const express  = require("express");
const router   = express.Router();
const { getItems, getItem, createItem, updateItem, deleteItem, getStats } = require("../controllers/item.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/stats", getStats);       // public — for homepage stats
router.get("/",      getItems);       // public
router.get("/:id",   getItem);        // public
router.post("/",     protect, createItem);    // admin
router.put("/:id",   protect, updateItem);    // admin
router.delete("/:id",protect, deleteItem);    // admin

module.exports = router;