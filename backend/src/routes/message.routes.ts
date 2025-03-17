import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getUsersForSidebar } from "../controllers/message.controller";

const router = express.Router();

router.get("/users", protect, getUsersForSidebar);

export default router;
