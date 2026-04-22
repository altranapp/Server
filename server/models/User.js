import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    balance: {
      type: Number,
      default: 0,
    },

    // KYC fields
    name: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    sex: {
      type: String,
      default: "",
    },

    kycStatus: {
      type: String,
      default: "not_submitted", // not_submitted | pending | approved | rejected
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
