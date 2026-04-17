const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title:       { type: String, required: [true, "Title is required"], trim: true },
  description: { type: String, required: [true, "Description is required"] },
  category: {
    type: String,
    required: true,
    enum: ["Vehicles", "Electronics", "Jewelry", "Vessels", "Luxury Goods", "Real Estate"],
  },
  status: {
    type: String,
    enum: ["Seized", "Under Review", "Available"],
    default: "Seized",
  },
  location:  { type: String, required: [true, "Location is required"] },
  value:     { type: Number, required: [true, "Value is required"], min: 0 },
  image:     { type: String, default: "" },
  featured:  { type: Boolean, default: false },
}, { timestamps: true });

// Enable text search on title, description, location
itemSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Item", itemSchema); 