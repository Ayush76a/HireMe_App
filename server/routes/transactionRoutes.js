const express = require('express');
const { getUserTransactions } = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware'); // Auth middleware to protect routes
const router = express.Router();

// Route to get user-specific transactions
router.get('/transactions/user', protect, getUserTransactions);

module.exports = router;
