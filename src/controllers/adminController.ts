import { Request, Response } from "express";
import { Service } from "../models/Service";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";

// @route   GET /api/admin/stats
// @desc    Get aggregate stats for dashboard
// @access  Private/Admin
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeTherapists = await User.countDocuments({ role: "therapist" });
    const totalClients = await User.countDocuments({ role: "client" });

    // Calculate total revenue from paid appointments
    const paidAppointments = await Appointment.find({
      paymentStatus: "paid",
    }).populate<{ service: any }>("service");
    const monthlyRevenue = paidAppointments.reduce(
      (sum, curr) => sum + (curr.service?.price || 0),
      0,
    );

    // Fetch recent appointments
    const recentAppointments = await Appointment.find()
      .populate("client", "name")
      .populate("therapist", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalServices,
      activeTherapists,
      totalClients,
      monthlyRevenue,
      recentAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error });
  }
};
