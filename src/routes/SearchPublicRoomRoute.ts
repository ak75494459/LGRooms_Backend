import express from "express";
import { param } from "express-validator";
import SearchPublicRoomController from "../controllers/SearchPublicRoomController";

const router = express.Router();

router.get(
  "/search/:location",
  param("location")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("location parameter must be valid string"),
  SearchPublicRoomController.searchPublicRooms
);

export default router;
