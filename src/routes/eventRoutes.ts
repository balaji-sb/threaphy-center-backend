import { Router } from "express";
import {
  getEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import { authenticateRole } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin routes
router.get("/admin/all", authenticateRole("admin"), getAllEvents);
router.post("/", authenticateRole("admin"), upload.single("image"), createEvent);
router.put("/:id", authenticateRole("admin"), upload.single("image"), updateEvent);
router.delete("/:id", authenticateRole("admin"), deleteEvent);

export default router;
