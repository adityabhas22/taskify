import mongoose from "mongoose";
import { User, Task } from "./model";

// Create models from schemas
const UserModel = mongoose.model("User", User);
const TaskModel = mongoose.model("Task", Task);

const connectDB = async () => {
  try {
    // Connect to Neon DB using DATABASE_URL
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Handle connection events

// Connect to database
// Export models for use in other parts of the application
export { UserModel, TaskModel };
export default connectDB;
