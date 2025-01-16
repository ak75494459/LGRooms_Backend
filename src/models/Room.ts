import mongoose from "mongoose";

const roomsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pgName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
});

const Rooms = mongoose.model("Rooms", roomsSchema);
export default Rooms;
