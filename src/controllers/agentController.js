const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create Agent (Only Admin)
const createAgent = async (req, res) => {
  try {
    const { fullname, email, password, mobile, profilePhoto } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({status:"failed", message: "Email already registered" });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new agent
    const newAgent = new User({
      fullname,
      email,
      password,
      mobile,
      role: "agent",
      profilePhoto,
    });

    await newAgent.save();
    res.status(201).json({ status:"success", message: "Agent created successfully", data: newAgent });
  } catch (error) {
    res.status(500).json({ status:"failed", message: "Error creating agent", error: error.message });
  }
};

// Get All Agents (Only Admin)
const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password");
    res.status(200).json({ status:"success" ,message: "Agents retrieved successfully", data:agents });
  } catch (error) {
    res.status(500).json({ status:"failed", message: "Error fetching agents", error: error.message });
  }
};

const updateAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { fullname, email, mobile, profilePhoto } = req.body;

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "failed", message: "Access denied. Only admins can update agents." });
    }

// Get All Agents (Only Admin)
    // Find agent and update details
    const updatedAgent = await User.findOneAndUpdate(
      { _id: agentId, role: "agent" },
      { fullname, email, mobile, profilePhoto },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedAgent) {
      return res.status(404).json({ status: "failed", message: "Agent not found" });
    }

    res.status(200).json({ status: "success", message: "Agent details updated successfully", data: updatedAgent });
  } catch (error) {
    res.status(500).json({ status: "failed", message: "Error updating agent", error: error.message });
  }
};

module.exports = { updateAgent };


// Get Agent Profile (Only Agent)
const getAgentProfile = async (req, res) => {
  try {
    const agent = await User.findById(req.user._id).select("-password");
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json({ status:"success", message: "Agent profile retrieved", data:agent });
  } catch (error) {
    res.status(500).json({ status:"failed", message: "Error retrieving profile", error: error.message });
  }
};

// Delete Agent (Only Admin)
const deleteAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await User.findOneAndDelete({ _id: agentId, role: "agent" });

    if (!agent) {
      return res.status(404).json({ status:"failed", message: "Agent not found" });
    }

    res.status(200).json({ status:"success", message: "Agent deleted successfully" ,data:{Agent_deleted:true} });
  } catch (error) {
    res.status(500).json({ status:"failed", message: "Error deleting agent", error: error.message });
  }
};

module.exports = { createAgent, getAllAgents, getAgentProfile, deleteAgent,updateAgent };
