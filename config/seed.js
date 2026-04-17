/**
 * SEED SCRIPT
 * Run once to populate your database:
 *   node config/seed.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Admin    = require("../models/Admin.model");
const Item     = require("../models/Item.model");

const items = [
  {
    title: "2024 Mercedes-Benz E-Class Sedan",
    description: "Seized during a federal investigation. Vehicle is in excellent condition with verified VIN and all original documentation. Low mileage, full service history available upon request.",
    category: "Vehicles", status: "Seized",
    location: "Federal Impound Lot, Washington D.C.",
    value: 58000, featured: true,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  },
  {
    title: "Electronic Equipment Collection",
    description: "Collection of 12 laptops, 8 tablets, and 20 smartphones seized at the border. All devices catalogued and stored securely pending investigation.",
    category: "Electronics", status: "Under Review",
    location: "Evidence Warehouse, New York",
    value: 34500, featured: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    title: "Luxury Watch & Jewelry Collection",
    description: "High-end timepieces including Rolex Submariner, Patek Philippe Calatrava, and diamond jewelry. All appraised by certified independent experts.",
    category: "Jewelry", status: "Available",
    location: "Secure Vault, Miami",
    value: 142000, featured: true,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
  },
  {
    title: "42ft Motor Yacht",
    description: "Fully equipped 42-foot motor yacht with twin 300HP engines, full cabin, navigation system, and all safety equipment. Seized at port of entry.",
    category: "Vessels", status: "Seized",
    location: "Marina Bay, San Diego",
    value: 385000, featured: false,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80",
  },
  {
    title: "Designer Handbag Collection",
    description: "47 designer handbags including Louis Vuitton, Chanel, and Hermès. Authenticity verification currently in progress by certified appraisers.",
    category: "Luxury Goods", status: "Under Review",
    location: "Evidence Room, Chicago",
    value: 67000, featured: false,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  },
  {
    title: "Residential Property - 4BR Colonial",
    description: "4-bedroom, 3-bathroom colonial home seized under asset forfeiture proceedings. Well-maintained and currently unoccupied.",
    category: "Real Estate", status: "Available",
    location: "Springfield, Virginia",
    value: 520000, featured: false,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Admin.deleteMany({});
    await Item.deleteMany({});
    console.log("🗑️  Cleared existing data");

    await Admin.create({
      email: "admin@hondurasborder.gov",
      password: "Admin@123",
      name: "Platform Admin",
    });
    console.log("👤 Admin created → admin@hondurasborder.gov / Admin@123");

    await Item.insertMany(items);
    console.log(`📦 ${items.length} items created`);

    console.log("\n🎉 Done! Now run: npm run dev");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();