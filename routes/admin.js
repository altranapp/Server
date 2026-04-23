import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET ALL USERS
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
