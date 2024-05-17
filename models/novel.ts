import mongoose, { Document, Schema } from 'mongoose';
import { IAuthor } from './author';
import { IPublisher } from './publisher';
import { IGenre } from './genre';

export interface INovel extends Document {
  title: string;
  description: string;
  releaseDate: Date;
  coverImage?: string | null;
  rating: number;
  status: 'ongoing' | 'completed';
  authors: (mongoose.Types.ObjectId | IAuthor)[];
  publisher?: mongoose.Types.ObjectId | IPublisher | null;
  genres: (mongoose.Types.ObjectId | IGenre)[];
}

const novelSchema: Schema<INovel> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      required: true,
      enum: ['ongoing', 'completed'],
    },
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
      },
    ],
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publisher',
      default: null,
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Novel = mongoose.models.Novel || mongoose.model<INovel>('Novel', novelSchema);
export { Novel };