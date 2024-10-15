const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController");

const router = express.Router();

router.post('/', protect, accessChat);
router.get('/', protect,  fetchChats);
router.post('/group', protect,  createGroupChat);
router.put('/rename-group', protect,  renameGroup);
router.put('/add-to-group', protect,  addToGroup);
router.put('/remove-from-group', protect,  removeFromGroup); 


module.exports = router;