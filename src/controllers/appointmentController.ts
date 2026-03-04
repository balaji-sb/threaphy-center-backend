import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { Service } from "../models/Service";
import { createOrder, verifySignature } from "../services/razorpay";
import { AuthRequest } from "../middleware/auth";

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    let appointments;
    if (role === "client") {
      appointments = await Appointment.find({ client: userId })
        .populate("therapist", "name")
        .populate("service", "title price")
        .sort({ date: 1 });
    } else if (role === "therapist") {
      appointments = await Appointment.find({ therapist: userId })
        .populate("client", "name")
        .populate("service", "title price")
        .sort({ date: 1 });
    } else {
      appointments = await Appointment.find()
        .populate("client", "name")
        .populate("therapist", "name")
        .populate("service", "title price")
        .sort({ date: 1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

export const bookAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, therapistId, date } = req.body;
    const clientId = req.user?.userId;

    // Check for double booking
    const existing = await Appointment.findOne({
      therapist: therapistId,
      date,
    });
    if (existing) {
      return res.status(400).json({ message: "Time slot unavailable" });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Create Razorpay Order
    // Amount in paise (multiply by 100)
    const order = await createOrder(service.price * 100);

    const appointment = await Appointment.create({
      client: clientId,
      therapist: therapistId,
      service: serviceId,
      date,
      status: "pending",
      paymentStatus: "pending",
      razorpayOrderId: order.id,
    });

    res.status(201).json({ appointment, order });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const isValid = verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayPaymentId: paymentId,
      },
      { new: true },
    );

    // TODO: Send Confirmation Email

    res.json({ message: "Payment verified successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
  }
};
