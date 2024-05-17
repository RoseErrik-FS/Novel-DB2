import { Schema, model, models, Model, Document } from 'mongoose';


export interface IMyList extends Document {
  userId: string;
  novelId: Schema.Types.ObjectId;
  collectionName: string;
}

const myListSchema = new Schema<IMyList>({
  userId: { type: String, required: true },
  novelId: { type: Schema.Types.ObjectId, ref: 'Novel', required: true },
  collectionName: { type: String, required: true },
}, {
  timestamps: true
});

export const MyList: Model<IMyList> = models.MyList || model<IMyList>('MyList', myListSchema);


