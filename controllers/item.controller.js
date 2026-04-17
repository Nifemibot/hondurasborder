const Item = require("../models/Item.model");

// GET /api/items
const getItems = async (req, res) => {
  try {
    const { search, category, status, featured, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search)   query.$text = { $search: search };
    if (category) query.category = category;
    if (status)   query.status = status;
    if (featured === "true") query.featured = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Item.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Item.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/items/:id
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found." });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/items  (admin)
const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/items/:id  (admin)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found." });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/items/:id  (admin)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found." });
    res.json({ success: true, message: "Item deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/items/stats
const getStats = async (req, res) => {
  try {
    const [total, seized, available, valueResult] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ status: "Seized" }),
      Item.countDocuments({ status: "Available" }),
      Item.aggregate([{ $group: { _id: null, total: { $sum: "$value" } } }]),
    ]);
    res.json({
      success: true,
      data: {
        total,
        seized,
        available,
        totalValue: valueResult[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getStats };