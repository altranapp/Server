import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: "user"
  },
  kycStatus: {
    type: String,
    default: "not_submitted"
  },
  name: String,
  country: String,
  phone: String,
  sex: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);
