import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>;
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;

// Second database connection for non auth related operations
const globalWithMongoose = global as typeof globalThis & {
  mongoose: any;
};

let novelDBClient: typeof mongoose;

async function connectToDatabase() {
  if (globalWithMongoose.mongoose) {
    novelDBClient = globalWithMongoose.mongoose;
  } else {
    if (typeof MONGODB_URI === 'string') {
      novelDBClient = await mongoose.connect(MONGODB_URI);
      globalWithMongoose.mongoose = novelDBClient;
    } else {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
  }

  return novelDBClient;
}

export { connectToDatabase };