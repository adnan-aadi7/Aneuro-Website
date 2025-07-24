// config/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
console.log("MONGODB_URI =", MONGODB_URI);

const connectDB = async () => {
  try {
   await mongoose.connect(
  "mongodb+srv://kainatrobi011:qz2QHzkbfxdcvNwq@cluster0.159c8ov.mongodb.net/aneuro",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
