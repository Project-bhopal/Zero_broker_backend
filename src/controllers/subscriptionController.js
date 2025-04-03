const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

// ✅ Buy a Subscription
exports.createSubscription = async (req, res) => {
  try {
    const { planId, autoRenew } = req.body;
    const userId = req.user.id; // Get from access token

    // Find the selected plan
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Create a new subscription
    const subscription = new Subscription({
      user: userId,
      plan: plan._id,
      role: req.user.role, // Get role from token
      category: plan.category,
      price: plan.price,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
      autoRenew
    });

    await subscription.save();
    res.status(201).json({ message: "Subscription created", subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Active Subscriptions
exports.getActiveSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ user: userId, status: "active" }).populate("plan");

    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.user.id;

    const subscription = await Subscription.findOne({ _id: subscriptionId, user: userId });
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    subscription.status = "canceled";
    await subscription.save();
    res.status(200).json({ message: "Subscription canceled", subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
