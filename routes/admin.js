import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Approve deposit (example)
router.post("/deposit", protect, adminOnly, async (req, res) => {
  const { userId, amount } = req.body;

  const user = await User.findById(userId);
  user.balance += amount;
  await user.save();

  res.json({ message: "Deposit approved" });
});

export default router;
