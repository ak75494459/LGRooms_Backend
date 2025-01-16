import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import ChatController from "../controllers/ChatController";

const router = express.Router();

router.post("/", jwtCheck, jwtParse, ChatController.accessChat);
router.get("/", jwtCheck, jwtParse, ChatController.fetchChats);

export default router;
