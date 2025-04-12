const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendResponse, handleError } = require("../utils/responseHandler");
const { checkUserByEmail } = require("../utils/checkUserExist");

// Allowed roles that can be created
const allowedRoles = {
  admin: ["agent", "driver"],
  agent: ["driver"],
};

// Create Agent or Driver (Admin creates both, Agent creates driver only)
const createUserByRole = async (req, res) => {
  try {
    const { fullname, email, password, mobile, profilePhoto, role } = req.body;

    // Check if role is allowed for the user
    if (!allowedRoles[req.user.role]?.includes(role)) {
      return sendResponse(res, 403, "failed", "You are not allowed to create this role");
    }

    // Check for existing email
    if (await checkUserByEmail(email)) {
      return sendResponse(res, 400, "failed", "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      mobile,
      role,
      profilePhoto,
    });

    await newUser.save();
    return sendResponse(res, 201, "success", `${role} created successfully`, { data: newUser });
  } catch (error) {
    return handleError(res, error, "Error creating user");
  }
};

// Get All Agents or Drivers (Admin gets both, Agent only gets drivers)
const getUsersByRole = async (req, res) => {
  try {
    const roleToGet = req.params.role;

    // Validate access
    if (!allowedRoles[req.user.role]?.includes(roleToGet)) {
      return sendResponse(res, 403, "failed", "You are not allowed to view this role");
    }

    const users = await User.find({ role: roleToGet }).select("-password");
    return sendResponse(res, 200, "success", `${roleToGet}s retrieved successfully`, { data: users });
  } catch (error) {
    return handleError(res, error, "Error fetching users");
  }
};

// Update User (Admin updates both, Agent updates driver only)
const updateUserByRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, email, mobile, profilePhoto } = req.body;

    const user = await User.findById(userId);

    if (!user || !allowedRoles[req.user.role]?.includes(user.role)) {
      return sendResponse(res, 403, "failed", "Not authorized to update this user");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, email, mobile, profilePhoto },
      { new: true, runValidators: true }
    ).select("-password");

    return sendResponse(res, 200, "success", "User updated successfully", { data: updatedUser });
  } catch (error) {
    return handleError(res, error, "Error updating user");
  }
};

// Delete User (Admin deletes both, Agent deletes driver only)
const deleteUserByRole = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || !allowedRoles[req.user.role]?.includes(user.role)) {
      return sendResponse(res, 403, "failed", "Not authorized to delete this user");
    }

    await User.findByIdAndDelete(userId);
    return sendResponse(res, 200, "success", "User deleted successfully", { data: { deleted: true } });
  } catch (error) {
    return handleError(res, error, "Error deleting user");
  }
};

// Get Profile (for Agent or Driver themselves)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user || (user.role !== "agent" && user.role !== "driver")) {
      return sendResponse(res, 404, "failed", "User not found");
    }

    return sendResponse(res, 200, "success", "Profile retrieved", { data: user });
  } catch (error) {
    return handleError(res, error, "Error retrieving profile");
  }
};

module.exports = {
  createUserByRole,
  getUsersByRole,
  updateUserByRole,
  deleteUserByRole,
  getProfile,
};








// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const { sendResponse, handleError } = require("../utils/responseHandler");
// const { checkUserByEmail } = require("../utils/checkUserExist");

// // Create Agent (Only Admin)
// const createAgent = async (req, res) => {
//   try {
//     const { fullname, email, password, mobile, profilePhoto } = req.body;

//     if (await checkUserByEmail(email)) {
//       return sendResponse(res, 400, "failed", "Email already registered");
//     }

//     const newAgent = new User({
//       fullname,
//       email,
//       password, // consider hashing: await bcrypt.hash(password, 10),
//       mobile,
//       role: "agent",
//       profilePhoto,
//     });

//     await newAgent.save();
//     return sendResponse(res, 201, "success", "Agent created successfully", { data: newAgent });
//   } catch (error) {
//     return handleError(res, error, "Error creating agent");
//   }
// };

// // Get All Agents (Only Admin)
// const getAllAgents = async (req, res) => {
//   try {
//     const agents = await User.find({ role: "agent" }).select("-password");
//     return sendResponse(res, 200, "success", "Agents retrieved successfully", { data: agents });
//   } catch (error) {
//     return handleError(res, error, "Error fetching agents");
//   }
// };

// // Update Agent (Only Admin)
// const updateAgent = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const { fullname, email, mobile, profilePhoto } = req.body;

//     const updatedAgent = await User.findOneAndUpdate(
//       { _id: agentId, role: "agent" },
//       { fullname, email, mobile, profilePhoto },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!updatedAgent) {
//       return sendResponse(res, 404, "failed", "Agent not found");
//     }

//     return sendResponse(res, 200, "success", "Agent details updated successfully", { data: updatedAgent });
//   } catch (error) {
//     return handleError(res, error, "Error updating agent");
//   }
// };


// // Get Agent Profile (Only Agent)
// const getAgentProfile = async (req, res) => {
//   try {
//     const agent = await User.findById(req.user._id).select("-password");

//     if (!agent || agent.role !== "agent") {
//       return sendResponse(res, 404, "failed", "Agent not found");
//     }

//     return sendResponse(res, 200, "success", "Agent profile retrieved", { data: agent });
//   } catch (error) {
//     return handleError(res, error, "Error retrieving profile");
//   }
// };

// // Delete Agent (Only Admin)
// const deleteAgent = async (req, res) => {
//   try {
//     const { agentId } = req.params;

//     const agent = await User.findOneAndDelete({ _id: agentId, role: "agent" });

//     if (!agent) {
//       return sendResponse(res, 404, "failed", "Agent not found");
//     }

//     return sendResponse(res, 200, "success", "Agent deleted successfully", { data: { Agent_deleted: true } });
//   } catch (error) {
//     return handleError(res, error, "Error deleting agent");
//   }
// };

// module.exports = {
//   createAgent,
//   getAllAgents,
//   getAgentProfile,
//   deleteAgent,
//   updateAgent,
// };






















// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// // Create Agent (Only Admin)
// const createAgent = async (req, res) => {
//   try {
//     const { fullname, email, password, mobile, profilePhoto } = req.body;

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({status:"failed", message: "Email already registered" });
//     }

//     // Hash password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new agent
//     const newAgent = new User({
//       fullname,
//       email,
//       password,
//       mobile,
//       role: "agent",
//       profilePhoto,
//     });

//     await newAgent.save();
//     res.status(201).json({ status:"success", message: "Agent created successfully", data: newAgent });
//   } catch (error) {
//     res.status(500).json({ status:"failed", message: "Error creating agent", error: error.message });
//   }
// };

// // Get All Agents (Only Admin)
// const getAllAgents = async (req, res) => {
//   try {
//     const agents = await User.find({ role: "agent" }).select("-password");
//     res.status(200).json({ status:"success" ,message: "Agents retrieved successfully", data:agents });
//   } catch (error) {
//     res.status(500).json({ status:"failed", message: "Error fetching agents", error: error.message });
//   }
// };

// const updateAgent = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const { fullname, email, mobile, profilePhoto } = req.body;

//     // Check if the user is an admin
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ status: "failed", message: "Access denied. Only admins can update agents." });
//     }

// // Get All Agents (Only Admin)
//     // Find agent and update details
//     const updatedAgent = await User.findOneAndUpdate(
//       { _id: agentId, role: "agent" },
//       { fullname, email, mobile, profilePhoto },
//       { new: true, runValidators: true, select: "-password" }
//     );

//     if (!updatedAgent) {
//       return res.status(404).json({ status: "failed", message: "Agent not found" });
//     }

//     res.status(200).json({ status: "success", message: "Agent details updated successfully", data: updatedAgent });
//   } catch (error) {
//     res.status(500).json({ status: "failed", message: "Error updating agent", error: error.message });
//   }
// };

// module.exports = { updateAgent };


// // Get Agent Profile (Only Agent)
// const getAgentProfile = async (req, res) => {
//   try {
//     const agent = await User.findById(req.user._id).select("-password");
//     if (!agent || agent.role !== "agent") {
//       return res.status(404).json({ message: "Agent not found" });
//     }
//     res.status(200).json({ status:"success", message: "Agent profile retrieved", data:agent });
//   } catch (error) {
//     res.status(500).json({ status:"failed", message: "Error retrieving profile", error: error.message });
//   }
// };

// // Delete Agent (Only Admin)
// const deleteAgent = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const agent = await User.findOneAndDelete({ _id: agentId, role: "agent" });

//     if (!agent) {
//       return res.status(404).json({ status:"failed", message: "Agent not found" });
//     }

//     res.status(200).json({ status:"success", message: "Agent deleted successfully" ,data:{Agent_deleted:true} });
//   } catch (error) {
//     res.status(500).json({ status:"failed", message: "Error deleting agent", error: error.message });
//   }
// };

// module.exports = { createAgent, getAllAgents, getAgentProfile, deleteAgent,updateAgent };
