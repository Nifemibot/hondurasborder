const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ── MIDDLEWARE ──
app.use(cors({
  origin: "*", // In production, set this to your frontend URL
  credentials: true,
}));
app.use(express.json());

// ── ROUTES ──
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/items",    require("./routes/item.routes"));
app.use("/api/messages", require("./routes/message.routes"));

// ── HEALTH CHECK ──
app.get("/", (req, res) => {
  res.json({
    status: "✅ HondurasBorder API is running",
    version: "1.0.0",
    endpoints: {
      auth:     "/api/auth",
      items:    "/api/items",
      messages: "/api/messages",
    }
  });
});

// ── GLOBAL ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in environment variables");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectDB();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel serverless function
module.exports = app;