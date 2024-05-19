// models\favorite.ts
import mongoose, { Document, Schema } from "mongoose";

import { IUser } from "./user";
import { INovel } from "./novel";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId | IUser;
  novel: mongoose.Types.ObjectId | INovel;
}

const favoriteSchema: Schema<IFavorite> = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
});

const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", favoriteSchema);

export { Favorite };
