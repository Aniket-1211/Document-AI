import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let gridFsBucket;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(mongoUri);
  gridFsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  console.log("MongoDB connected");
};

const getGridFsBucket = () => {
  if (!gridFsBucket) {
    throw new Error("GridFS bucket is not initialized");
  }

  return gridFsBucket;
};

export default connectDB;
export { getGridFsBucket };
