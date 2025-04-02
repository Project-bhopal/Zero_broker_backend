const Plan = require("../models/Plan");

exports.getPlansByRoleAndInterest = async (req, res) => {
  try {
    const { role, interest } = req.user; // Extract from authenticated user

    // Find plans that match the user's role and interest
    const plans = await Plan.find({ 
      role, 
      category: { $in: interest } 
    });

    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
