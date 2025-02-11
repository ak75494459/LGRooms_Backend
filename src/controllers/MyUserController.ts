import { Request, Response } from "express";
import User from "../models/User";

const getCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });

    if (!currentUser) {
      res.status(404).json({ message: "user not found" });
    }
    res.json(currentUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in getting User" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      res.status(200).send();
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
    console.log(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, number, addressLine1 } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    user.name = name;
    user.number = number;
    user.addressLine1 = addressLine1;

    user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const updateIsChatSelected = async (req: Request, res: Response):Promise<any> => {
  try {
    const { isChatSelected } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    user.isChatSelected = isChatSelected;
    await user.save(); // Ensure update is completed

    console.log("Updated isChatSelected:", user.isChatSelected); 

    res.json({ isChatSelected: user.isChatSelected });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating isChatSelected" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
  updateIsChatSelected,
};
