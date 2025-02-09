import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import Notification from "../models/Notification";

const sendMessage = async (req: Request, res: Response): Promise<any> => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    // Create new message
    let message = await Message.create({
      sender: req.userId,
      content: content,
      chat: chatId,
    });

    // Populate necessary fields
    message = await message.populate("sender", "email name");
    message = await message.populate("chat");
    message = await message.populate({
      path: "chat.users",
      select: "email name isChatSelected",
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // Find all users in the chat except the sender
    const chat = await Chat.findById(chatId).populate(
      "users",
      "_id name email isChatSelected"
    );

    const receivers = chat?.users.filter(
      (user: any) => user._id.toString() !== req.userId
    );
    const isReceiverChatSelected = receivers?.some(
      (user: any) => user.isChatSelected
    );
    console.log(isReceiverChatSelected);

    // If no receiver has selected the chat, create notifications
    if (!isReceiverChatSelected) {
      const receivers = chat?.users
        .filter((user: any) => user._id.toString() !== req.userId)
        .map((user: any) => user._id);

      if (receivers && receivers.length > 0) {
        const notifications = receivers.map((receiverId) => ({
          message: message._id,
          reciver: receiverId,
          isRead: false,
        }));

        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json(message);
     // ✅ Send only one response
  } catch (error) {
    console.error("Error in sending message:", error);
    return res.status(500).json({ message: "Error in sending message" });
  }
};

const allMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const message = await Message.find({ chat: req.params._chatId })
      .populate("sender", "name email")
      .populate("chat");

    res.json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in in fetching messages" });
  }
};

export default { sendMessage, allMessages };
