const jwt   = require("jsonwebtoken");
const Admin = require("../models/Admin.model");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required." });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials." });

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const getMe = (req, res) => {
  res.json({ success: true, admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name } });
};

module.exports = { login, getMe };