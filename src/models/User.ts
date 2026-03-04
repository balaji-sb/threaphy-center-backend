import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "therapist" | "client";
  phone?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "therapist", "client"],
      default: "client",
    },
    phone: { type: String },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
