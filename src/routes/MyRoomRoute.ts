import express from "express";
import multer, { FileFilterCallback } from "multer";
import MyRoomController from "../controllers/MyRoomController.ts";
import { validateMyRoomRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, //5mb
  },
});
const uploadMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  upload.array("imageFile", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size too large! Max 10MB allowed." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ error: "Unexpected file field name." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post(
  "/",
  validateMyRoomRequest,
  jwtCheck,
  jwtParse,
  uploadMiddleware,
  MyRoomController.createRooms
);

router.delete("/:id", jwtCheck, jwtParse, MyRoomController.deleteRoom);
router.get("/", jwtCheck, jwtParse, MyRoomController.getMyRooms);
router.get("/all", jwtCheck, jwtParse, MyRoomController.getRooms);

export default router;
