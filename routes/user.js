import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";

const router = express.Router();


// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed
    });

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Register error" });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      email: user.email,
      balance: user.balance,
      tier: user.tier
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error" });
  }
});


// ✅ GET USER DATA
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});


// ✅ SELECT TIER
router.post("/tier", protect, async (req, res) => {
  const { tier } = req.body;

  const user = await User.findById(req.user.id);
  user.tier = tier;

  await user.save();

  res.json({ message: "Tier updated" });
});


// ✅ DEPOSIT
router.post("/deposit", protect, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user.id);
  user.balance += Number(amount);

  await user.save();

  res.json({ message: "Deposit successful", balance: user.balance });
});


// ✅ WITHDRAW
router.post("/withdraw", protect, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user.id);

  if (user.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.balance -= amount;
  await user.save();

  res.json({ message: "Withdraw successful", balance: user.balance });
});

export default router;
