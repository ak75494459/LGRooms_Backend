import { Request, Response } from "express";
import PublicRoom from "../models/PublicRoom";

const searchPublicRooms = async (req: Request, res: Response): Promise<any> => {
    try {
      const location = req.params.location;
      const searchQuery = (req.query.searchQuery as string) || ""; // Extract searchQuery
      const sortOption = (req.query.sortOption as string) || "rent";
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 10;
  
      let query: any = {};
  
      // Case-insensitive location filter
      query["location"] = new RegExp(location, "i");
  
      // Apply search query if provided
      if (searchQuery) {
        query["$or"] = [
          { title: new RegExp(searchQuery, "i") }, // Match title
          { description: new RegExp(searchQuery, "i") }, // Match description
        ];
      }
  
      // Apply rent range based on sortOption
      if (sortOption === "rent_5000_10000") {
        query["rent"] = { $gte: 5000, $lt: 10000 };
      } else if (sortOption === "rent_10000_15000") {
        query["rent"] = { $gte: 10000, $lt: 15000 };
      }
  
      // Fetch filtered rooms with sorting and pagination
      const rooms = await PublicRoom.find(query)
        .sort({ rent: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      // Count total matching results
      const total = await PublicRoom.countDocuments(query);
  
      res.json({
        data: rooms,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
  

export default { searchPublicRooms };
