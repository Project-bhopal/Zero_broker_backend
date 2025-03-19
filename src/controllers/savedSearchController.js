const SavedSearch = require("../models/propertFilter");
const Property = require("../models/Property");

// saving filetr searchs with name
const saveSearch = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search_name, filters } = req.body; 

    let filter = {};
    if (filters.purpose) filter["details.purpose"] = filters.purpose;
    if (filters.bedrooms) filter["details.bedrooms"] = parseInt(filters.bedrooms);
    if (filters.bathrooms) filter["details.bathrooms"] = parseInt(filters.bathrooms);
    if (filters.completion_status) filter["details.completion_status"] = filters.completion_status;
    if (filters.usage) filter["details.usage"] = filters.usage;
    if (filters.min_price || filters.max_price) {
      filter.price = {};
      if (filters.min_price) filter.price.$gte = parseFloat(filters.min_price);
      if (filters.max_price) filter.price.$lte = parseFloat(filters.max_price);
    }

    const properties = await Property.find(filter);

    const savedSearch = new SavedSearch({
      userId,
      search_name,
      filters,
      properties: properties.map((p) => p._id)
    });

    await savedSearch.save();

    res.status(201).json({
      success: true,
      message: "Search saved successfully",
      search_name,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving search",
      error: error.message,
    });
  }
};




// getting all Saved Searchesnames list
const getAllSavedSearches = async (req, res) => {
  try {
    const userId = req.user._id;
    const searches = await SavedSearch.find({ userId }).select("search_name");

    if (searches.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No saved searches found for this user.",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Saved searches retrieved successfully",
      searches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving saved searches",
      error: error.message,
    });
  }
};


// get property list of particular search_name
const getSearchProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search_name } = req.params;

    const search = await SavedSearch.findOne({ userId, search_name }).populate("properties");
    console.log("===>",search)

    if (!search) {
      return res.status(404).json({
        success: false,
        message: "Search not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      search_name,
      properties: search.properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving properties",
      error: error.message,
    });
  }
};

module.exports = { saveSearch ,getAllSavedSearches,getSearchProperties};
