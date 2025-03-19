const Property = require("../models/Property");

const getfilterData = async (req, res) => {
  try {
    let filter = {};
    const userId = req.user._id;  
    console.log("userId",userId)

    const { purpose, bedrooms, bathrooms, completion_status, usage, min_price, max_price } = req.query;

    if (purpose) filter["details.purpose"] = purpose;
    if (bedrooms) filter["details.bedrooms"] = parseInt(bedrooms);
    if (bathrooms) filter["details.bathrooms"] = parseInt(bathrooms);
    if (completion_status) filter["details.completion_status"] = completion_status;
    if (usage) filter["details.usage"] = usage;    
 
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = parseFloat(min_price);
      if (max_price) filter.price.$lte = parseFloat(max_price);
    }

    const properties = await Property.find(filter);

    res.status(200).json({
      success: true,
      message: "Filtered properties retrieved successfully",
      searchBy: userId,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving filtered properties", 
      error: error.message,
    });
  }
};

module.exports={getfilterData};