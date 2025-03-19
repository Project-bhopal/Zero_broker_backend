const Property = require("../models/Property");
const nestify = require("../utils/nestify");
const parseFields = require("../utils/parseFields");
const RequestedProperty = require('../models/RequestedProperty');

exports.createProperty = async (req, res) => {
  try {
    const nestedBody = nestify(req.body);
    const parsedData = parseFields(nestedBody, req.files);

    const newProperty = new Property({ ...parsedData, listing: { added_on: new Date(), verified_on: null } });
    await newProperty.save();

    res.status(201).json({
       success: true,
        message: "Property created successfully",
         property: newProperty 
        });
  } catch (error) {
    res.status(500).json({
       success: false, 
       message: "Property not created",
        error: error.message 
      });
  }
};


exports.updateProperty = async (req, res) => {
  try {
    const nestedBody = nestify(req.body);
    const parsedData = parseFields(nestedBody, req.files);

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, parsedData, { new: true, runValidators: true });

    if (!updatedProperty) return res.status(404).json({
          success: false, 
        message: "Property not found"
       });

    res.status(200).json({ 
      success: true,
       message: "Property updated successfully", 
       property: updatedProperty 
      });
  } catch (error) {
    res.status(500).json({
       success: false,
        message: "Property not updated",
         error: error.message
        });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { "approval_status.visible_to_buyers": true, "approval_status.approved_by": userId, "listing.status": "Online","approval_status.status":"Accepted", "listing.verified_on": new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) return res.status(404).json({ success: false, message: "Property not found" });

    res.status(200).json({
       success: true,
        message: "Property approved successfully",
         property: updatedProperty 
        });
  } catch (error) {
    res.status(500).json({
       success: false, 
       message: "Property not approved", 
       error: error.message 
      });
  }
};

exports.getAllProperties = async (req,res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ success: true, message: "Properties retrieved successfully", properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Properties not retrieved", error: error.message });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.getPropertiesByAgent = async (req, res) => {
  try {
    const agentId = req.user.id; 
    console.log("===>agentId",agentId)

    // Find properties and populate the requestedProperty to get assignedAgent
    const properties = await Property.find({})
      .populate({
        path: 'requested_id',
        model: 'RequestedProperty',
        populate: {
          path: 'assignedAgent',
          model: 'User',
          select: 'name email',
        }
      })
      .populate('approval_status.approved_by', 'name email');

      console.log("===>properties",properties)
    // Filter properties where the assignedAgent matches the agentId
    const filteredProperties = properties.filter(property =>
      property.requested_id?.assignedAgent?._id.toString() === agentId
    );
console.log("filteredProperties==>",filteredProperties)
    res.status(200).json({
      success: true,
      count: filteredProperties.length,
      data: filteredProperties,
    });
  } catch (error) {
    console.error("Error in getAgentProperties:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
