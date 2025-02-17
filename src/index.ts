import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute";
import MyRoomRoute from "./routes/MyRoomRoute";
import { v2 as cloudinary } from "cloudinary";
import PublicRoomRoute from "./routes/PublicRoomRoute";
import ChatRoute from "./routes/ChatRoute";
import MessageRoute from "./routes/MessageRoute";
import { Server } from "socket.io";
// import multer from "multer";
import NotificationRoute from "./routes/NotificationRoute";
import SearchPublicRoomRoute from "./routes/SearchPublicRoomRoute";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Database connection failed:", error));
// const upload = multer();
const app = express();
app.use(cors());
app.use(express.json());
// app.use(upload.none());
app.use(express.urlencoded({ extended: true }));
app.use("/api/my/user", MyUserRoute);
app.use("/api/my/rooms", MyRoomRoute);
app.use("/api/public/rooms", PublicRoomRoute);
app.use("/api/public/rooms", SearchPublicRoomRoute);
app.use("/api/my/chat", ChatRoute);
app.use("/api/message", MessageRoute);
app.use("/api/my/notification", NotificationRoute);

const server = app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (!userData) return;
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat.users) return console.error("Chat users not defined");

    chat.users.forEach((user: any) => {
      if (user._id === newMessage.sender._id) return;
      socket.to(user._id).emit("message received", newMessage);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
