const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageControllers');


const router = express.Router();

router.post('/', protect, sendMessage)
router.get('/getMessage/:chatId', protect, allMessages)


module.exports = router;