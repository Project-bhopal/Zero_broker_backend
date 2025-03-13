const RequestedProperty = require("../models/RequestedProperty");

// Create a new requested property listing by seller
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "seller" ) {
      return res.status(403).json({
        status: "failed",
        message: "Only sellers can request property listings.",
        error: "Access denied",
        data: null
      });
    }

    const { propertyName, propertyType, purpose, area, address, location, reasonForSaleOrRent } = req.body;

    if (!propertyName || !propertyType || !purpose || !area || !address || !location) {
      return res.status(400).json({
        status: "failed",
        message: "All required fields must be filled.",
        error: "Missing required fields",
        data: null
      });
    }

    const newRequest = new RequestedProperty({
      seller: req.user._id,
      propertyName,
      propertyType,
      purpose,
      area,
      address,
      location,
      reasonForSaleOrRent
    });

    await newRequest.save();

    res.status(201).json({
      status: "success",
      message: "Property request submitted successfully.",
      data: newRequest,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
      data: null
    });
  }
};

// Get all pending requests for agents
exports.getAllRequestsForAgents = async (req, res) => {
  try {
    if (req.user.role !== "agent") {
      return res.status(403).json({
        status: "failed",
        message: "Only agents can view property requests.",
        error: "Access denied",
        data: null
      });
    }

    const requests = await RequestedProperty.find({ status: "Pending" }).populate("seller", "name email");

    if (!requests.length) {
      return res.status(404).json({
        status: "failed",
        message: "No pending property requests found.",
        error: "No data available",
        data: null
      });
    }

    res.status(200).json({
      status: "success",
      message: "Pending property requests retrieved.",
      data: requests,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
      data: null
    });
  }
};

// Agent accepts a request
exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.role !== "agent") {
      return res.status(403).json({
        status: "failed",
        message: "Only agents can accept requests.",
        error: "Access denied",
        data: null
      });
    }

    const request = await RequestedProperty.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        status: "failed",
        message: "Property request not found.",
        error: "Invalid request ID",
        data: null
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        status: "failed",
        message: "Request is already accepted or rejected.",
        error: "Invalid operation",
        data: null
      });
    }

    request.status = "Accepted";
    request.assignedAgent = req.user._id;
    await request.save();

    res.status(200).json({
      status: "success",
      message: "Request accepted successfully.",
      data: request,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
      data: null
    });
  }
};
