const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");


const getHelpers = asyncHandler(async(req, res)=>{
  try {
    const helpers = await User.find({ role: 'helper' }).select('-password'); // Exclude password field
    res.json(helpers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch helpers' });
  }
})

const contactHelper = asyncHandler(async(req, res)=>{
  const { helperId } = req.params;
  const { task, description, fees } = req.body;

  // Add logic to handle the form submission (e.g., store in DB, send email)
  if (!task || !description || !fees) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // You can use helperId to reference the helper in your database
  console.log(`Helper ID: ${helperId}, Task: ${task}, Description: ${description}, Fees: ${fees}`);

  // For now, just return a success response
  res.status(200).json({ message: 'Request sent successfully!' });
})

module.exports = {
  getHelpers,
  contactHelper
};