const Property = require("../models/Property");


exports.createProperty = async (req, res) => {
  try {
    // console.log("===>",req.body)
    console.log("Uploaded Files:", req.files);
    console.log("Request Body:", req.body);
    const { 
      name, title, description, price, currency, reference_number, listing_platform 
    } = req.body;
    console.log("===>",req.body)
    const location = req.body.location ? JSON.parse(req.body.location) : {};
    const details = req.body.details ? JSON.parse(req.body.details) : {};
    const other_amenities = req.body.other_amenities ? JSON.parse(req.body.other_amenities) : [];
    const features_amenities = req.body.features_amenities ? JSON.parse(req.body.features_amenities) : [];
    const nearby_buildings = req.body.nearby_buildings ? JSON.parse(req.body.nearby_buildings) : [];
    const building_information = req.body.building_information ? JSON.parse(req.body.building_information) : {};

    const images = req.files?.images ? req.files.images.map(file => file.filename) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.filename) : [];

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrls = images.map(filename => `${baseUrl}/uploads/images/${filename}`);
    const videoUrls = videos.map(filename => `${baseUrl}/uploads/videos/${filename}`);


    console.log("Uploaded Images:", imageUrls);
    console.log("Uploaded Videos:", videoUrls);

    const developer_notes = {
      images: imageUrls,
      videos: videoUrls,
      image_count: images.length,
      video_count: videos.length,
      video_available: req.body.video_available,
      virtual_tour_available: req.body.virtual_tour_available,
      contact_options: req.body.contact_options ? JSON.parse(req.body.contact_options) : [],
      tags: req.body.tags ? JSON.parse(req.body.tags) : []
    };

    const listing = req.body.listing ? JSON.parse(req.body.listing) : {
      added_on: new Date(),
      verified_on: null,
    };
   
    const newProperty = new Property({
      name,
      title,
      description,
      price,
      currency,
      location,
      details,
      other_amenities,
      features_amenities,
      nearby_buildings,
      building_information,
      reference_number,
      listing_platform,
      listing,
      developer_notes,
    });
    console.log("===>",newProperty)

    await newProperty.save();

    
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: {
        ...newProperty._doc,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Property not created ", error: error.message });
  }
};




exports.updateProperty = async (req, res) => {
  try {
    const { name, title, description, price, currency, reference_number, listing_platform } = req.body;

    const location = req.body.location ? JSON.parse(req.body.location) : {};
    const details = req.body.details ? JSON.parse(req.body.details) : {};
    const other_amenities = req.body.other_amenities ? JSON.parse(req.body.other_amenities) : [];
    const features_amenities = req.body.features_amenities ? JSON.parse(req.body.features_amenities) : [];
    const nearby_buildings = req.body.nearby_buildings ? JSON.parse(req.body.nearby_buildings) : [];
    const building_information = req.body.building_information ? JSON.parse(req.body.building_information) : {};
    const listing = req.body.listing ? JSON.parse(req.body.listing) : {
      added_on: new Date(),
      verified_on: null,
    };
    const developer_notes = req.body.developer_notes ? JSON.parse(req.body.developer_notes) : {};

    const images = req.files?.images ? req.files.images.map(file => file.filename) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.filename) : [];
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrls = images.map(filename => `${baseUrl}/uploads/images/${filename}`);
    const videoUrls = videos.map(filename => `${baseUrl}/uploads/videos/${filename}`);


    if (!developer_notes.images) developer_notes.images = [];
    if (!developer_notes.videos) developer_notes.videos = [];

    developer_notes.images.push(...imageUrls);
    developer_notes.videos.push(...videoUrls);
    developer_notes.image_count = developer_notes.images.length;
    developer_notes.video_count = developer_notes.videos.length;

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        name,
        title,
        description,
        price,
        currency,
        location,
        details,
        other_amenities,
        features_amenities,
        nearby_buildings,
        building_information,
        reference_number,
        listing_platform,
        listing,
        developer_notes
      },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty  
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Property not updated", error: error.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const userId = req.user.id; // Admin's ID from token
    const propertyId = req.params.id; 
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { "approval_status.visible_to_buyers": true, "approval_status.approved_by": userId, "listing.status": "Active", "listing.verified_on": new Date() }, 
      { new: true, runValidators: true }
    );
    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({
      success: true,
      message: "Property approved successfully!",
      property: updatedProperty
    });

  }
  catch(error){
    res.status(500).json({ success: false, message: "Property not approved", error: error.message });
  }
}

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      properties: properties 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Properties not retrieved", error: error.message });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    console.log("===>",property)
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
