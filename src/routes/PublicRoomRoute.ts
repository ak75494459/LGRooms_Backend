import express from "express";
import PublicRoomController from "../controllers/PublicRoomController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.post("/", jwtCheck, jwtParse, PublicRoomController.createPublicRoom);
router.get("/", PublicRoomController.getPublicRoom);

export default router;
