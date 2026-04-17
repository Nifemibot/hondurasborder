const express  = require("express");
const router   = express.Router();
const { createMessage, getMessages, getMessagesByItem, markAsRead } = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/",                    createMessage);          // public
router.get("/",       protect,      getMessages);            // admin
router.get("/item/:itemId",         getMessagesByItem);      // public
router.patch("/:id/read", protect,  markAsRead);             // admin

module.exports = router;