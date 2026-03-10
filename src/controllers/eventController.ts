import { Request, Response } from "express";
import { Event } from "../models/Event";

// @route   GET /api/events
// @desc    Get all active events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ active: true }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// @route   GET /api/events/all
// @desc    Get all events (including inactive) - for Admin
// @access  Private/Admin
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

// @route   POST /api/events
// @desc    Create an event
// @access  Private/Admin
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = { ...req.body };
    
    // Handle image file
    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }

    // In case title/description/location are sent as JSON strings from FormData
    if (typeof eventData.title === 'string') eventData.title = JSON.parse(eventData.title);
    if (typeof eventData.description === 'string') eventData.description = JSON.parse(eventData.description);
    if (typeof eventData.location === 'string') eventData.location = JSON.parse(eventData.location);

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private/Admin
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = { ...req.body };

    // Handle image file
    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }

    // In case title/description/location are sent as JSON strings from FormData
    if (typeof eventData.title === 'string') eventData.title = JSON.parse(eventData.title);
    if (typeof eventData.description === 'string') eventData.description = JSON.parse(eventData.description);
    if (typeof eventData.location === 'string') eventData.location = JSON.parse(eventData.location);

    const event = await Event.findByIdAndUpdate(req.params.id, eventData, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private/Admin
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
