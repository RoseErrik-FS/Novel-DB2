import mongoose, { Document, Schema } from 'mongoose';

import { IVolume } from './volume';

export interface IChapter extends Document {
  title: string;
  number: number;
  releaseDate: Date;
  volume: mongoose.Types.ObjectId | IVolume;
}

const chapterSchema: Schema<IChapter> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  volume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volume',
    required: true,
  },
});

const Chapter = mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', chapterSchema);

export { Chapter };