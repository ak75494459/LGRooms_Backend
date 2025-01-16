import { Request, Response } from "express";
import Chat from "../models/Chat";
import User from "../models/User";

const accessChat = async (req: Request, res: Response): Promise<any> => {
  const { targetId } = req.body;

  if (!targetId) {
    console.log("targetId not send with request");
    return res.sendStatus(400);
  }

  var isChat: any = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.userId } } },
      { users: { $elemMatch: { $eq: targetId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });
  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData: any = {
      chatName: "sender",
      users: [req.userId, targetId],
    };
  }
  try {
    const createChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users"
    );
    return res.status(200).json(fullChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in creating Chat" });
  }
};

const fetchChats = async (req: Request, res: Response): Promise<any> => {
  try {
    const chats = Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
      .populate("users")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const result = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in fetching chat" });
  }
};

export default { accessChat, fetchChats };
