import { Router } from "express";
import {
  getTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  deleteTherapist,
} from "../controllers/therapistController";
import { authenticateRole } from "../middleware/auth";

const router = Router();

router.get("/", getTherapists);
router.get("/:id", getTherapistById);

// Only admins can manage therapists
router.post("/", authenticateRole("admin"), createTherapist);
router.put("/:id", authenticateRole("admin"), updateTherapist);
router.delete("/:id", authenticateRole("admin"), deleteTherapist);

export default router;
