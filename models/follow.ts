import mongoose, { Document, Schema } from 'mongoose';

import { IUser } from './user';
import { IAuthor } from './author';
import { INovel } from './novel';

export interface IFollow extends Document {
  user: mongoose.Types.ObjectId | IUser;
  followedAuthor?: mongoose.Types.ObjectId | IAuthor | null;
  followedNovel?: mongoose.Types.ObjectId | INovel | null;
}

const followSchema: Schema<IFollow> = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followedAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  followedNovel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
  },
});

const Follow = mongoose.models.Follow || mongoose.model<IFollow>('Follow', followSchema);

export { Follow };