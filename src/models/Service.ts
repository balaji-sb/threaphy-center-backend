import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  title: {
    en: string;
    ta: string;
  };
  description: {
    en: string;
    ta: string;
  };
  durationMinutes: number;
  price: number;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Service = model<IService>("Service", serviceSchema);
