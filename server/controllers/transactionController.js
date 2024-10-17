const Transaction = require('../models/transactionModel'); // Import the Transaction model
const asyncHandler = require('express-async-handler');

// Get transactions by user email (either hirer or helper)
const getUserTransactions = asyncHandler(async (req, res) => {
  try {
    const userEmail = req.user.email; // Assuming req.user contains the logged-in user's email

    // Fetch transactions where the user is either the hirer (user_email) or the helper (helper_email)
    const transactions = await Transaction.find({
      $or: [{ user_email: userEmail }, { helper_email: userEmail }]
    }).sort({ date: -1 }); // Sort transactions by date (latest first)

    // If no transactions are found
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user' });
    }

    // Send the found transactions
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching user-specific transactions:', error);
    res.status(500).json({ message: 'Failed to fetch user transactions' });
  }
});

module.exports = {
  getUserTransactions,
};
