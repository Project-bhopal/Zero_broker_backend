const express = require("express");
const router = express.Router();
const { accessTokenVerify } = require("../middleware/authMiddleware");
const {
  createUserByRole,
  getUsersByRole,
  updateUserByRole,
  deleteUserByRole,
  getProfile,
} = require("../controllers/agentController");

// Create user by role (admin can create agent/driver, agent can create driver)
router.post("/create", accessTokenVerify, createUserByRole);

// Get users by role (admin gets agents/drivers, agent gets drivers)
router.get("/role/:role", accessTokenVerify, getUsersByRole);

// Update user (admin/agent based on permission)
router.put("/update/:userId", accessTokenVerify, updateUserByRole);

// Delete user (admin/agent based on permission)
router.delete("/delete/:userId", accessTokenVerify, deleteUserByRole);

// Get logged-in agent or driver profile
router.get("/profile", accessTokenVerify, getProfile);

module.exports = router;





// const express = require("express");
// const router = express.Router();
// const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");
// const { createAgent, getAllAgents, getAgentProfile, deleteAgent ,updateAgent} = require("../controllers/agentController");

// // Routes for Admin Only
// router.post("/create", accessTokenVerify, authorizeRoles("admin"), createAgent);
// router.get("/all", accessTokenVerify, authorizeRoles("admin"), getAllAgents);
// router.delete("/delete/:agentId", accessTokenVerify, authorizeRoles("admin"), deleteAgent);
// router.put("/update/:agentId", accessTokenVerify,authorizeRoles("admin"), updateAgent);

// // Routes for Agents only
// router.get("/profile", accessTokenVerify, authorizeRoles("agent"), getAgentProfile);

// module.exports = router;
