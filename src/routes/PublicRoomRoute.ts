import express from "express";
import PublicRoomController from "../controllers/PublicRoomController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.none(),
  PublicRoomController.createPublicRoom
);
router.get("/", PublicRoomController.getPublicRooms);
router.get("/:id", PublicRoomController.getPublicRoom);

export default router;
