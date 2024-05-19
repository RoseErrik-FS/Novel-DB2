// models\genre.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IGenre extends Document {
  name: string;
}

const genreSchema: Schema<IGenre> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Genre =
  mongoose.models.Genre || mongoose.model<IGenre>("Genre", genreSchema);

export { Genre };
