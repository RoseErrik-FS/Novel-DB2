// lib\db.ts
import { MongoClient } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Extend the global object to include custom properties for MongoDB and Mongoose
declare global {
  var mongoClient: MongoClient | undefined;
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

// MongoDB Client
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.mongoClient) {
    const client = new MongoClient(MONGODB_URI);
    global.mongoClient = client;
    clientPromise = client.connect();
  } else {
    clientPromise = global.mongoClient.connect();
  }
} else {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

// Mongoose Connection
let mongooseConnection: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
  if (!global.mongooseConnection) {
    global.mongooseConnection = mongoose.connect(
      MONGODB_URI,
      {} as ConnectOptions
    );
  }
  mongooseConnection = global.mongooseConnection;
} else {
  mongooseConnection = mongoose.connect(MONGODB_URI, {} as ConnectOptions);
}

// Ensure the mongoose connection is established
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) await mongooseConnection;
  return mongoose;
};

export { connectToDatabase };
export default clientPromise;
