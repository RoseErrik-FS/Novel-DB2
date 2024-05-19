// models\publisher.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPublisher extends Document {
  name: string;
  location?: string | null;
  website?: string | null;
}

const publisherSchema: Schema<IPublisher> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
  },
  website: {
    type: String,
  },
});

const Publisher =
  mongoose.models.Publisher ||
  mongoose.model<IPublisher>("Publisher", publisherSchema);

export { Publisher };
