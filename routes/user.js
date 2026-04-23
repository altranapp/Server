import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { protect } from "../middleware/auth.js";
import { applyProfit } from "../utils/profit.js";

const router = express.Router();

const TIERS = {
  1: { min: 300, rate: 0.02 },
  2: { min: 500, rate: 0.03 },
  3: { min: 1000, rate: 0.05 }
};

// PROFILE
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  await applyProfit(user);

  res.json(user);
});

// SELECT TIER
router.post("/select-tier", async (req, res) => {
  try {
    const { tier } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    user.tier = tier;

    await user.save();

    res.json({ message: "Tier selected successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DEPOSIT REQUEST
router.post("/deposit", async (req, res) => {
  try {
    const { amount } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Transaction.create({
      userId: decoded.id,
      type: "deposit",
      amount
    });

    res.json({ message: "Deposit request sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REQUEST WITHDRAW
router.post("/request-withdraw", protect, async (req, res) => {
  const { amount } = req.body;

  await Transaction.create({
    userId: req.user.id,
    type: "withdraw",
    amount
  });

  res.json({ message: "Withdraw request sent" });
});

export default router;
