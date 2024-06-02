import mongoose from "mongoose";
import { INovel } from "../models/novel";

export const getMockNovels = (): INovel[] => [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: "Mock Novel 1",
    description: "This is a description for Mock Novel 1",
    releaseDate: new Date(),
    coverImage: null,
    rating: 4.5,
    status: "ongoing",
    authors: [new mongoose.Types.ObjectId()],
    publisher: new mongoose.Types.ObjectId(),
    genres: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
  } as INovel,
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: "Mock Novel 2",
    description: "This is a description for Mock Novel 2",
    releaseDate: new Date(),
    coverImage: null,
    rating: 4.0,
    status: "completed",
    authors: [new mongoose.Types.ObjectId()],
    publisher: new mongoose.Types.ObjectId(),
    genres: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
  } as INovel,
  // Add more mock novels as needed
];
