import { Router } from "express";
import { getBlogs, createBlog } from "../controllers/blogController";

const router = Router();
router.get("/", getBlogs);
router.post("/", createBlog);

export default router;
