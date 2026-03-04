import { Router } from "express";
import { getAdminStats } from "../controllers/adminController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Apply auth middleware
router.use(authenticate);

// In a real app we would add role-based checking (role === "admin")
router.get("/stats", getAdminStats);

export default router;
