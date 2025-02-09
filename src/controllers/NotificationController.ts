import { Request, Response } from "express";
import Notification from "../models/Notification";

const getNotification = async (req: Request, res: Response): Promise<any> => {
  try {
    const notifications = await Notification.find({
      reciver: req.userId,
      isRead: false,
    })
      .populate({
        path: "message",
        populate: [{ path: "chat" }, { path: "sender" }],
      })
      .populate("reciver")
      .populate("chat");

    if (!notifications || notifications.length === 0) {
      return res.json([]);
    }
    if (notifications.length > 0) {
      return res.json(notifications);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in fetching notifications" });
  }
};

const deleteNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    await Notification.deleteMany({ reciver: req.userId });
    res.json({ message: "notification cleared" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error in clearing notification" });
  }
};

const markNotificationsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notification = await Notification.updateMany(
      { reciver: req.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Error updating notifications" });
  }
};

export default {
  getNotification,
  deleteNotification,
  markNotificationsRead,
};
