const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // For password reset
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
