// models\review.ts
import mongoose, { Document, Schema } from "mongoose";

import { IUser } from "./user";
import { INovel } from "./novel";

export interface IReview extends Document {
  rating: number;
  comment: string;
  novel: mongoose.Types.ObjectId | INovel;
  user: mongoose.Types.ObjectId | IUser;
  timestamp: Date;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export { Review };
