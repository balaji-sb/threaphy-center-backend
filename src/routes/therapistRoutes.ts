import { Router } from "express";
import { getTherapists } from "../controllers/therapistController";

const router = Router();
router.get("/", getTherapists);

export default router;
