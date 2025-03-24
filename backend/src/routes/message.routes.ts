import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/users", protect, getUsersForSidebar);
router.get("/:id", protect, getMessages);

router.post("/send/:id", protect, upload.array("image", 10), sendMessage);
export default router;
