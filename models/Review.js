import mongoose from "mongoose";
import UserModel from "./User.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
    },
    text: {
      type: String,
    },
    fullName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Rewiew", reviewSchema);

export default Review;
