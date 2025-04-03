const express = require("express");
const { createSubscription, getActiveSubscriptions, cancelSubscription } = require("../controllers/subscriptionController");
const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Create Subscription (Buy Plan)
router.post("/buy", accessTokenVerify, createSubscription);

// ✅ Get Active Subscriptions
router.get("/active", accessTokenVerify, getActiveSubscriptions);

// ✅ Cancel Subscription
router.post("/cancel", accessTokenVerify, cancelSubscription);

module.exports = router;
