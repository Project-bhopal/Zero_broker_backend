const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    name: { type: String, },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true },

    location: {
        country: { type: String },
        emirate: { type: String },
        city: { type: String },
        landmark: { type: String },
        address: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        postal_code: { type: String },
        community: { type: String },
        neighborhood: { type: String },
        street: { type: String },
        building_name: { type: String },
        floor: { type: Number },
        apartment_number: { type: String }
    },

    details: {
        property_type: { type: String, },
        purpose: { type: String,  },
        bedrooms: { type: Number, },
        bathrooms: { type: Number, },
        size: {
            value: { type: Number },
            unit: { type: String}
        },
        completion_status: { type: String,  },
        furnishing: { type: String},
        ownership: { type: String },
        usage: { type: String,  },
        floor_number: { type: Number },
        parking_available: { type: Boolean, default: false }
    },

    other_amenities: { type: [String] },
    features_amenities: { type: [String] },

    building_information: {
        name: { type: String },
        year_of_completion: { type: Number },
        total_floors: { type: Number },
        total_building_area: {
            value: { type: Number },
            unit: { type: String }
        },
        offices: { type: Number }
    },

    reference_number: { type: String,  },

    listing: {
        added_on: { type: Date , default: Date.now() },
        verified_on: { type: Date },
        status: { type: String, enum: ['Online', 'Offline', 'Pending'], default: 'Pending' }
    },

    approval_status: {
            visible_to_buyers: { type: Boolean, default: false },
            approved_by:{type: mongoose.Schema.Types.ObjectId, ref: "User"},  //admin
            status:{type: String, enum: ['Accepted', 'Rejected', 'Pending'], default: 'Pending' },
        //   admin_review:{
            // admin_id:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
            // status:{type:String},
            // reviewed_on:{type:String},
            // comments: "Property meets guidelines, approved for listing."
        // }
        approved_to:{type: mongoose.Schema.Types.ObjectId, ref: "RequestedProperty"}
    },

    requested_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RequestedProperty',
    
      },

    nearby_buildings: { type: [String] },

    listing_platform: { type: String },

    developer_notes: {
        image_count: { type: Number },
        images: { type: [String] },
        video_count: { type: Number },
        videos: { type: [String] },
        video_available: { type: Boolean, default: false },
        virtual_tour_available: { type: Boolean, default: false },
        contact_options: { type: [String] },
        tags: { type: [String] }
    }
});

module.exports = mongoose.model('Property', PropertySchema);
