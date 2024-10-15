const express = require('express');
const { register, authUser, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', authUser)
router.get('/', protect, getAllUsers)

module.exports = router;