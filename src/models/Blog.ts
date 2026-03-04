import { Schema, model, Document, Types } from "mongoose";

export interface IBlog extends Document {
  title: {
    en: string;
    ta: string;
  };
  content: {
    en: string;
    ta: string;
  };
  excerpt: {
    en: string;
    ta: string;
  };
  slug: string;
  author: Types.ObjectId;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    excerpt: {
      en: { type: String },
      ta: { type: String },
    },
    slug: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Blog = model<IBlog>("Blog", blogSchema);
