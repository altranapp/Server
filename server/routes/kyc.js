import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Submit KYC
router.post("/submit", async (req, res) => {
  try {
    const { userId, name, country, phone, sex } = req.body;

    const user = await User.findById(userId);

    user.name = name;
    user.country = country;
    user.phone = phone;
    user.sex = sex;
    user.kycStatus = "pending";

    await user.save();

    res.json({ message: "KYC submitted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
