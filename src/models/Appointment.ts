import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  client: Types.ObjectId;
  therapist: Types.ObjectId;
  service: Types.ObjectId;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  sessionNotes?: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    therapist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    sessionNotes: { type: String }, // Encrypted at application layer ideally
  },
  { timestamps: true },
);

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema,
);
