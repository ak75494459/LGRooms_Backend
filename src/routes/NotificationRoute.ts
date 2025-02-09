import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import NotificationController from "../controllers/NotificationController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, NotificationController.getNotification);
router.delete(
  "/",
  jwtCheck,
  jwtParse,
  NotificationController.deleteNotification
);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  NotificationController.markNotificationsRead
);

export default router;
