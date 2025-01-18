import { Request, Response } from "express";
import User from "../models/User";
import PublicRoom from "../models/PublicRoom";

const createPublicRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const mainContoller = await User.findOne({ _id: req.userId });

    if (!mainContoller) {
      res.status(404).json({ message: "user not found" });
    }

    const owner = mainContoller?.email;
    if (owner !== process.env.PUBLIC_ROOM_EMAIL) {
      res.status(404).json({ message: "owner not found" });
    }

    if (owner === process.env.PUBLIC_ROOM_EMAIL) {
      const publicRoom = new PublicRoom(req.body);
      await publicRoom.save();
      res.status(201).json(publicRoom);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in getting User" });
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
    const PublicRooms = await PublicRoom.findOne({ _id: req.params.id});
    res.json(PublicRooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in getting public room" });
  }
};

export default { createPublicRoom, getPublicRoom, getPublicRooms };
