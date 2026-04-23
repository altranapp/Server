import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ✅ ADD PROFILE ROUTE HERE
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(401).json({ message: "Token failed" });
  }
});
    
// Get balance
router.get("/balance/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deposit
router.post("/deposit", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    user.balance += amount;

    await user.save();

    res.json({
      message: "Deposit successful",
      balance: user.balance,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Withdraw
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);

    if (user.kycStatus !== "approved") {
      return res.status(403).json({ message: "KYC required" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    user.balance -= amount;
    await user.save();

    res.json({
      message: "Withdrawal successful",
      balance: user.balance,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
