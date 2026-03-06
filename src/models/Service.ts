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
  icon?: string;
  methodology?: {
    en: string;
    ta: string;
  };
  confidentiality?: {
    en: string;
    ta: string;
  };
  whatToExpect?: {
    en: string[];
    ta: string[];
  };
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
    icon: { type: String, default: "✨" },
    methodology: {
      en: { type: String, default: "" },
      ta: { type: String, default: "" },
    },
    confidentiality: {
      en: { type: String, default: "" },
      ta: { type: String, default: "" },
    },
    whatToExpect: {
      en: { type: [String], default: [] },
      ta: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

export const Service = model<IService>("Service", serviceSchema);
