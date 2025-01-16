import express from "express";
import multer from "multer";
import MyRoomController from "../controllers/MyRoomController.ts";
import { validateMyRoomRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.post(
  "/",
  validateMyRoomRequest,
  jwtCheck,
  jwtParse,
  upload.array("imageFile", 10),
  MyRoomController.createRooms
);

router.delete("/:id", jwtCheck, jwtParse, MyRoomController.deleteRoom);

router.get("/", jwtCheck, jwtParse, MyRoomController.getMyRooms);

export default router;
