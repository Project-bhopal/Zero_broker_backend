const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

router.post("/subscribe", subscriptionController.createSubscription);
router.get("/:userId", subscriptionController.getSubscription);
router.put("/:userId/cancel", subscriptionController.cancelSubscription);

module.exports = router;
