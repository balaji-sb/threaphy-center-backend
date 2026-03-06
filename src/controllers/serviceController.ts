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
export const createService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error });
  }
};

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private/Admin
export const updateService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
};

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private/Admin
export const deleteService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }
    res.json({ message: "Service removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};
// @route   GET /api/services/:id
// @desc    Get a single service by ID
// @access  Public
export const getServiceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error });
  }
};
