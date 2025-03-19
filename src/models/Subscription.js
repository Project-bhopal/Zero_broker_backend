const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["basic", "premium"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["active", "expired", "canceled"], default: "active" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
