const mongoose = require("mongoose");

const SavedSearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  search_name: { type: String, required: true },
  filters: {type: Object, required: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedSearch", SavedSearchSchema);
