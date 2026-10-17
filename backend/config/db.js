import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; 
    if (!uri) {
      throw new Error("MongoDB URI is not defined in the environment variables.");
    }
    await mongoose.connect(uri); 
    console.log("DB Connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); 
  }
};
