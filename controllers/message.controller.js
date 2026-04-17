const Message = require("../models/Message.model");
const Item    = require("../models/Item.model");

// POST /api/messages  (public)
const createMessage = async (req, res) => {
  try {
    const { itemId, name, email, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found." });

    const msg = await Message.create({ itemId, itemTitle: item.title, name, email, message });
    res.status(201).json({ success: true, message: "Message sent successfully.", data: msg });
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/messages  (admin)
const getMessages = async (req, res) => {
  try {
    const [messages, unreadCount] = await Promise.all([
      Message.find().populate("itemId", "title category").sort({ createdAt: -1 }),
      Message.countDocuments({ read: false }),
    ]);
    res.json({ success: true, data: messages, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/messages/item/:itemId  (public)
const getMessagesByItem = async (req, res) => {
  try {
    const messages = await Message.find({ itemId: req.params.itemId }).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/messages/:id/read  (admin)
const markAsRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createMessage, getMessages, getMessagesByItem, markAsRead };