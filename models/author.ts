import mongoose, { Document, Types, Schema } from 'mongoose';

export interface IAuthor extends Document {
  _id: Types.ObjectId;
  name: string;
  bio?: string;
  website?: string;
}

const authorSchema: Schema<IAuthor> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
});

const Author = mongoose.models.Author || mongoose.model<IAuthor>('Author', authorSchema);

export { Author };
