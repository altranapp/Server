import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// USERS
router.get("/users", protect, adminOnly, async (req, res) => {
  res.json(await User.find());
});

// TRANSACTIONS
router.get("/transactions", protect, adminOnly, async (req, res) => {
  res.json(await Transaction.find());
});

// APPROVE
router.post("/approve/:id", protect, adminOnly, async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  const user = await User.findById(tx.userId);

  if (tx.type === "deposit") user.balance += tx.amount;
  if (tx.type === "withdraw") user.balance -= tx.amount;

  tx.status = "approved";

  await user.save();
  await tx.save();

  res.json({ message: "Approved" });
});

// REJECT
router.post("/reject/:id", protect, adminOnly, async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  tx.status = "rejected";
  await tx.save();

  res.json({ message: "Rejected" });
});

export default router;
