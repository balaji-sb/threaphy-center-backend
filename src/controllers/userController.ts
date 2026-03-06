import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

// @route   GET /api/users/clients
// @desc    Get all clients
// @access  Private/Admin
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const clients = await User.find({ role: "client" }).select("-passwordHash").sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

// @route   POST /api/users/clients
// @desc    Create a client
// @access  Private/Admin
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const client = await User.create({
      name,
      email,
      passwordHash,
      role: "client"
    });

    const clientObj = client.toObject();
    // @ts-ignore
    delete clientObj.passwordHash;

    res.status(201).json(clientObj);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};

// @route   PUT /api/users/clients/:id
// @desc    Update a client
// @access  Private/Admin
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const updateData: any = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const client = await User.findOneAndUpdate(
      { _id: req.params.id, role: "client" },
      updateData,
      { new: true }
    ).select("-passwordHash");

    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error });
  }
};

// @route   DELETE /api/users/clients/:id
// @desc    Delete a client
// @access  Private/Admin
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await User.findOneAndDelete({ _id: req.params.id, role: "client" });
    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }
    res.json({ message: "Client removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error });
  }
};
