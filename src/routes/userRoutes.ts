import { Router } from "express";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/userController";
import { authenticateRole } from "../middleware/auth";

const router = Router();

// Only admins can manage clients through these routes
router.use(authenticateRole("admin"));

router.get("/clients", getClients);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

export default router;
