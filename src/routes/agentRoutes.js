const express = require("express");
const router = express.Router();
const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");
const { createAgent, getAllAgents, getAgentProfile, deleteAgent ,updateAgent} = require("../controllers/agentController");

// Routes for Admin Only
router.post("/create", accessTokenVerify, authorizeRoles("admin"), createAgent);
router.get("/all", accessTokenVerify, authorizeRoles("admin"), getAllAgents);
router.delete("/delete/:agentId", accessTokenVerify, authorizeRoles("admin"), deleteAgent);
router.put("/update/:agentId", accessTokenVerify,authorizeRoles("admin"), updateAgent);

// Routes for Agents onl
router.get("/profile", accessTokenVerify, authorizeRoles("agent"), getAgentProfile);

module.exports = router;
