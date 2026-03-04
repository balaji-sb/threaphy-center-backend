import { Request, Response } from "express";
import { User } from "../models/User";

// @route   GET /api/users/therapists
// @desc    Get all therapists
// @access  Public
export const getTherapists = async (req: Request, res: Response) => {
  try {
    const therapists = await User.find({ role: "therapist" }).select(
      "-passwordHash",
    );
    res.json(therapists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching therapists", error });
  }
};
