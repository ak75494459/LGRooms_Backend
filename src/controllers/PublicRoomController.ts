import { Request, Response } from "express";
import User from "../models/User";
import PublicRoom from "../models/PublicRoom";

const createPublicRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Received Body:", req.body);

    if (!req.body.rent || !req.body.description || !req.body.location) {
      return res
        .status(400)
        .json({ message: "Rent and Description are required" });
    }

    const mainController = await User.findOne({ _id: req.userId });

    if (!mainController) {
      return res.status(404).json({ message: "User not found" });
    }

    const owner = mainController._id;
    if (owner.toString() !== process.env.PUBLIC_ROOM_ID) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Create new public room
    const publicRoom = new PublicRoom({
      rent: Number(req.body.rent), // Ensure rent is a number
      description: req.body.description,
      imageUrl: Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [], // Ensure it's an array
      location: req.body.location,
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
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    let query: any = {};
    const publicRooms = await PublicRoom.find(query)
      .sort({ rent: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const total = await PublicRoom.countDocuments(query);
    res.json({
      data: publicRooms,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    });
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
