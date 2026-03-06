import { Router } from "express";
import {
  getAppointments,
  bookAppointment,
  verifyPayment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController";
import { authenticateRole } from "../middleware/auth";

const router = Router();

// Allow all authenticated roles to GET (filtering happens in controller)
router.get(
  "/",
  authenticateRole("admin", "therapist", "client"),
  getAppointments,
);

// Only clients can book or verify payment
router.post("/book", authenticateRole("client"), bookAppointment);
router.post("/verify-payment", authenticateRole("client"), verifyPayment);

// Only admins can update or delete for now
router.put("/:id", authenticateRole("admin"), updateAppointment);
router.delete("/:id", authenticateRole("admin"), deleteAppointment);

export default router;
