import mongoose from "mongoose";

const publicRoomSchema = new mongoose.Schema({
  imageUrl: {
    type: [String],
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
});

const PublicRoom = mongoose.model("PublicRoom", publicRoomSchema);

export default PublicRoom;
