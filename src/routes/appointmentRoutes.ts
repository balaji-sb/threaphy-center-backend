import { Router } from "express";
import {
  getAppointments,
  bookAppointment,
  verifyPayment,
} from "../controllers/appointmentController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Make sure auth middleware is applied to these routes
router.use(authenticate);

router.get("/", getAppointments);
router.post("/book", bookAppointment);
router.post("/verify-payment", verifyPayment);

export default router;
