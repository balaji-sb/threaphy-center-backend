import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  title: {
    en: string;
    ta: string;
  };
  description: {
    en: string;
    ta: string;
  };
  date: Date;
  location: {
    en: string;
    ta: string;
  };
  image?: string;
  link?: string;
  active: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    date: { type: Date, required: true },
    location: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    image: { type: String },
    link: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Event = model<IEvent>("Event", eventSchema);
