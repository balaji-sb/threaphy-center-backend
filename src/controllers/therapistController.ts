import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

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

// @route   POST /api/users/therapists
// @desc    Create a therapist
// @access  Private/Admin
export const createTherapist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if therapist exists
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const therapist = await User.create({
      name,
      email,
      passwordHash,
      role: "therapist",
    });

    const therapistObj = therapist.toObject();
    // @ts-ignore
    delete therapistObj.passwordHash;

    res.status(201).json(therapistObj);
  } catch (error) {
    res.status(500).json({ message: "Error creating therapist", error });
  }
};

// @route   PUT /api/users/therapists/:id
// @desc    Update a therapist
// @access  Private/Admin
export const updateTherapist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const updateData: any = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const therapist = await User.findOneAndUpdate(
      { _id: req.params.id, role: "therapist" },
      updateData,
      { new: true },
    ).select("-passwordHash");

    if (!therapist) {
      res.status(404).json({ message: "Therapist not found" });
      return;
    }

    res.json(therapist);
  } catch (error) {
    res.status(500).json({ message: "Error updating therapist", error });
  }
};

// @route   DELETE /api/users/therapists/:id
// @desc    Delete a therapist
// @access  Private/Admin
export const deleteTherapist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const therapist = await User.findOneAndDelete({
      _id: req.params.id,
      role: "therapist",
    });
    if (!therapist) {
      res.status(404).json({ message: "Therapist not found" });
      return;
    }
    res.json({ message: "Therapist removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting therapist", error });
  }
};
// @route   GET /api/users/therapists/:id
// @desc    Get therapist by ID
// @access  Public
export const getTherapistById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const therapist = await User.findOne({
      _id: req.params.id,
      role: "therapist",
    }).select("-passwordHash");

    if (!therapist) {
      res.status(404).json({ message: "Therapist not found" });
      return;
    }

    res.json(therapist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching therapist", error });
  }
};
