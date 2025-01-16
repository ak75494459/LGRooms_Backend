import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";

const sendMessage = async (req: Request, res: Response): Promise<any> => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.userId,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "email name");
    message = await message.populate("chat");
    message = await message.populate({
      path: "chat.users",
      select: "email name",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in in sending Message" });
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
