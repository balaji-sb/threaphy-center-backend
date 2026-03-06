import { Router } from "express";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { authenticateRole } from "../middleware/auth";

const router = Router();

router.get("/", getBlogs);

// Only admins can manage blogs
router.post("/", authenticateRole("admin"), createBlog);
router.put("/:id", authenticateRole("admin"), updateBlog);
router.delete("/:id", authenticateRole("admin"), deleteBlog);

export default router;
