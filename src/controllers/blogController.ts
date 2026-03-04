import { Request, Response } from "express";
import { Blog } from "../models/Blog";

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// @route   POST /api/blogs
// @desc    Create a blog post
// @access  Private/Admin|Therapist
export const createBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      // @ts-ignore
      author: req.user?.userId,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog post", error });
  }
};
