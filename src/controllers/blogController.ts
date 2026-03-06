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
export const createBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
// @access  Private/Admin|Therapist
export const updateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Basic update - would ideally check if current user is the author or an admin
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog post", error });
  }
};

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
// @access  Private/Admin|Therapist
export const deleteBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.json({ message: "Blog removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post", error });
  }
};
