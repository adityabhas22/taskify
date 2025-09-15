import mongoose from "mongoose";
const { Schema } = mongoose;

const User = new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
});

const Task = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: { type: String, required: false },
  category: String,
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Export the schemas
export { User, Task };
