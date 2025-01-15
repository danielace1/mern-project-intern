import mongoose, { Schema } from "mongoose";

const emailVerification = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 43200,
  },

  expiresAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("EmailVerification", emailVerification);
