import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";
import { authenticateRole } from "../middleware/auth";

const router = Router();

router.get("/", getServices);
router.get("/:id", getServiceById);

// Only admins can manage services
router.post("/", authenticateRole("admin"), createService);
router.put("/:id", authenticateRole("admin"), updateService);
router.delete("/:id", authenticateRole("admin"), deleteService);

export default router;
