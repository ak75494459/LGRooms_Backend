import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  reciver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isRead: { type: Boolean, default: false }, // Track if the user has seen the notification
  createdAt: { type: Date, default: Date.now },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
