const Subscription = require("../models/Subscription");

// Create Subscription
exports.createSubscription = async (req, res) => {
    try {
        const { userId, plan, amount, endDate } = req.body;
        const newSubscription = new Subscription({ userId, plan, amount, endDate });
        await newSubscription.save();
        res.status(201).json({ message: "Subscription created", subscription: newSubscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Subscription Details
exports.getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.params.userId });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { userId: req.params.userId },
            { status: "canceled" },
            { new: true }
        );
        res.status(200).json({ message: "Subscription canceled", subscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
