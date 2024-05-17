import { MongoClient } from 'mongodb';
import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Extend the global object to include custom properties for MongoDB and Mongoose
declare global {
  var mongoClient: MongoClient | undefined;
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global.mongoClient) {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
  global.mongoClient = client;
} else {
  clientPromise = global.mongoClient.connect();
}

let mongooseConnection: Promise<typeof mongoose>;

if (!global.mongooseConnection) {
  mongooseConnection = mongoose.connect(MONGODB_URI, {} as ConnectOptions);
  global.mongooseConnection = mongooseConnection;
} else {
  mongooseConnection = global.mongooseConnection;
}

// Ensure the mongoose connection is established
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) await mongooseConnection;
  return mongoose;
};

export { connectToDatabase };
export default clientPromise;
