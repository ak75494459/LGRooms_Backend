import mongoose from "mongoose";

const publicRoomSchema = new mongoose.Schema(
  {
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
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt automatically
);

const PublicRoom = mongoose.model("PublicRoom", publicRoomSchema);
export default PublicRoom;

