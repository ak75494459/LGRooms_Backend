import express from "express";
import multer, { FileFilterCallback } from "multer";
import MyRoomController from "../controllers/MyRoomController.ts";
import { validateMyRoomRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed") as unknown as null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter, // Add file filter
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
router.get("/all", jwtCheck, jwtParse, MyRoomController.getRooms);

export default router;
