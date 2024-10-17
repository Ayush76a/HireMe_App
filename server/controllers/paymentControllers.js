const crypto = require("crypto");
const {cashfree, Cashfree} = require("cashfree-pg");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel"); // Import the transaction model

// Generate a unique order ID
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  const orderId = hash.digest('hex');
  return orderId.substr(0, 12); // Generate a 12-character unique order ID
}

// Initiate payment and create a pending transaction
const Pay = async (req, res) => {
  const { fees, helper_name, helper_email } = req.body;

  try {
    // Fetch helper details
    const helper = await User.findOne({ email: helper_email });
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }
    const helper_id = helper._id;

    // Generate order ID for payment
    let order_id = generateOrderId();

    // Create a payment request for Cashfree
    let request = {
      "order_amount": fees,
      "order_currency": "INR",
      "order_id": order_id,
      "customer_details": {
        "customer_id": helper_id,
        "customer_Phone": "+918957272258",
        "customername": helper_name,
        "customer_email": helper_email,
      }
    };

    // Create a pending transaction in the database before initiating payment
    await Transaction.create({
      transaction_ref_id: crypto.randomBytes(16).toString('hex'), // Unique transaction reference ID
      order_id: order_id,
      user_id: req.user._id,  // Assuming the logged-in user is the hirer (sender)
      user_email: req.user.email, // Hirer's email
      helper_email: helper_email, // Helper's email
      amount: fees,
      status: 'pending',  // Initially pending
    });

    // Initiate the payment with Cashfree
    Cashfree.PGCreateOrder("2023-08-01", request)
      .then(response => {
        res.json(response.data); // Send the response back to the frontend
      })
      .catch(error => {
        console.error('Error initiating payment:', error);
        res.status(500).json({ message: "Error initiating payment" });
      });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

// Verify payment status and update the transaction accordingly
const Verify = async (req, res) => {
    try {
      let { orderId } = req.body;
  
      // Log the order ID received for verification
      console.log('Verifying payment for order ID:', orderId);
  
      const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
  
      // Log the response received from Cashfree
      console.log('Cashfree response:', response.data);
  
      const paymentData = response.data;
  
      if (paymentData && paymentData.payment_status === "SUCCESS") {
        // Update the transaction status in the database
        const updatedTransaction = await Transaction.findOneAndUpdate(
          { order_id: orderId },
          { status: "completed" },
          { new: true }
        );
        console.log('Transaction updated to completed:', updatedTransaction);
        res.json({ message: "Payment verified and transaction updated to completed" });
      } else {
        const updatedTransaction = await Transaction.findOneAndUpdate(
          { order_id: orderId },
          { status: "failed" },
          { new: true }
        );
        console.log('Transaction updated to failed:', updatedTransaction);
        res.json({ message: "Payment verification failed, transaction updated to failed" });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: "Payment verification error" });
    }
  };
  
module.exports = {
  Pay, 
  Verify
};
