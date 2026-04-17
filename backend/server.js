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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("👉 Make sure your MONGO_URI in .env is correct");
    process.exit(1);
  });