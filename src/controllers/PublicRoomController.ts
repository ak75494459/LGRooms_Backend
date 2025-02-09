import { Request, Response } from "express";
import User from "../models/User";
import PublicRoom from "../models/PublicRoom";

const createPublicRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Received Body:", req.body);

    if (!req.body.rent || !req.body.description) {
      return res
        .status(400)
        .json({ message: "Rent and Description are required" });
    }

    const mainController = await User.findOne({ _id: req.userId });

    if (!mainController) {
      return res.status(404).json({ message: "User not found" });
    }

    const owner = mainController.email;
    if (owner !== process.env.PUBLIC_ROOM_EMAIL) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Create new public room
    const publicRoom = new PublicRoom({
      rent: Number(req.body.rent), // Ensure rent is a number
      description: req.body.description,
      imageUrl: Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [], // Ensure it's an array
    });

    await publicRoom.save();
    return res.status(201).json(publicRoom);
  } catch (error) {
    console.error("Error in creating public room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPublicRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const publicRooms = await PublicRoom.find();
    res.json(publicRooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in getting public rooms" });
  }
};

const getPublicRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const PublicRooms = await PublicRoom.findOne({ _id: req.params.id });
    res.json(PublicRooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in getting public room" });
  }
};

export default { createPublicRoom, getPublicRoom, getPublicRooms };
