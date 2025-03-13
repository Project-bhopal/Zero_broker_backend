const mongoose = require('mongoose');

const requestedPropertySchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the seller (user)
    required: true,
  },
  propertyName: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['Sale', 'Rent'],
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reasonForSaleOrRent: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the agent who accepted the request
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RequestedProperty', requestedPropertySchema);
