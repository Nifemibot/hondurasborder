const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  itemId:    { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  itemTitle: { type: String },
  name:      { type: String, required: [true, "Name is required"], trim: true },
  email:     { type: String, required: [true, "Email is required"], lowercase: true },
  message:   { type: String, required: [true, "Message is required"], maxlength: 1000 },
  read:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);