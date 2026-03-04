import { Request, Response } from "express";
import { Service } from "../models/Service";

// @route   GET /api/services
// @desc    Get all services
// @access  Public
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};

// @route   POST /api/services
// @desc    Create a service
// @access  Private/Admin
export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error });
  }
};
