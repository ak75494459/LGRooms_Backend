import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Rooms from "../models/Room";

const getMyRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const rooms = await Rooms.find({ user: req.userId });

    if (!rooms) {
      return res.status(404).json({ message: "Rooms not found" });
    }

    res.json(rooms);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error in fetching rooms" });
  }
};

const getRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const rooms = await Rooms.find({}).populate("user");
    if (!rooms) {
      return res.status(404).json({ message: "Rooms not found" });
    }
    res.json(rooms);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error in fetching rooms" });
  }
};

const createRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const files = req.files as Express.Multer.File[]; // Ensure `req.files` is an array

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload all images to Cloudinary
    const imageUrls = await Promise.all(files.map((file) => uploadImage(file)));

    // Create the room with the array of image URLs
    const room = new Rooms({
      ...req.body,
      imageUrl: imageUrls, // Assuming the schema has an `imageUrls` array
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    // Save the room to the database
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteRoom = async (req: Request, res: Response) => {
  try {
    if (req.userId) {
      const room = await Rooms.deleteOne({ _id: req.params.id });
    }
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error in deleting room" });
  }
};

// Function to upload a single image to Cloudinary
const uploadImage = async (file: Express.Multer.File) => {
  try {
    const base64Image = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export default {
  createRooms,
  getMyRooms,
  deleteRoom,
  getRooms,
};
