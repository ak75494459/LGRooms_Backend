import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import MessageController from "../controllers/MessageController";

const router = express.Router();

router.post("/", jwtCheck, jwtParse, MessageController.sendMessage);
router.get("/:_chatId", jwtCheck, jwtParse, MessageController.allMessages);

export default router;
