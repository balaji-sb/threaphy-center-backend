import { Router } from "express";
import { getAdminStats } from "../controllers/adminController";
import { authenticateRole } from "../middleware/auth";

const router = Router();

// Only tokens signed with the ADMIN secret will pass
router.use(authenticateRole("admin"));

router.get("/stats", getAdminStats);

export default router;
