// models\character.ts
import mongoose, { Document, Schema } from "mongoose";

import { INovel } from "./novel";

export interface ICharacter extends Document {
  name: string;
  description?: string | null;
  novel: mongoose.Types.ObjectId | INovel;
}

const characterSchema: Schema<ICharacter> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
});

const Character =
  mongoose.models.Character ||
  mongoose.model<ICharacter>("Character", characterSchema);

export { Character };
