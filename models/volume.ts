import mongoose, { Document, Schema } from 'mongoose';

import { INovel } from './novel';

export interface IVolume extends Document {
  number: number;
  releaseDate: Date;
  novel: mongoose.Types.ObjectId | INovel;
}

const volumeSchema: Schema<IVolume> = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true,
  },
});

const Volume = mongoose.models.Volume || mongoose.model<IVolume>('Volume', volumeSchema);

export { Volume };