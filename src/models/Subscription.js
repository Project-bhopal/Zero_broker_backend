const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who bought the subscription
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true }, // Selected plan
  role: { type: String, enum: ["buyer", "seller", "agent"], required: true }, // User role
  category: { 
    type: String, 
    enum: ["buy", "rent", "boost"], 
    required: true 
  }, // Plan type
  
  price: { type: Number, required: true }, // Plan price
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, // Payment status
  transactionId: { type: String }, // Payment transaction ID (if applicable)
  
  startDate: { type: Date, default: Date.now }, // Subscription start date
  expiryDate: { type: Date, required: true }, // When the plan expires

  status: { 
    type: String, 
    enum: ["active", "expired", "canceled"], 
    default: "active" 
  }, // Current status of the subscription

  autoRenew: { type: Boolean, default: false }, // If the plan should auto-renew

}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
