const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail")
const Notification = require('../models/notificationModel'); // Import Notification model


const getHelpers = asyncHandler(async(req, res)=>{
  try {
    const helpers = await User.find({ role: 'helper' }).select('-password'); // Exclude password field
    res.json(helpers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch helpers' });
  }
})


// contact Helper
const contactHelper = asyncHandler(async (req, res) => {
  const { helperId } = req.params;
  const { task, description, fees } = req.body;

  try {
    const helper = await User.findById(helperId);
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }

    const userEmail = req.user.email; 
    const userName = req.user.name;   

    // Create the notification first
    const notification = await Notification.create({
      userEmail: userEmail,
      helperEmail: helper.email,
      helperName: helper.name,
      task: task,
      fees: fees,
      message: `A new job has been assigned to ${helper.name}. Task: ${task}, Fees: $${fees}. Awaiting approval or decline.`,
      taskStatus: 'pending',
    });

    // Generate approval and decline URLs using notification._id
    // Create the approval and decline URLs
    const approvalUrl = `http://localhost:8080/respondJob/approve?email=${userEmail}`;
    const declineUrl = `http://localhost:8080/respondJob/decline?email=${userEmail}`;

    const emailMessage = `
  <h1>New Job Request</h1>
  <p><strong>Task:</strong> ${task}</p>
  <p><strong>Description:</strong> ${description}</p>
  <p><strong>Proposed Fees:</strong> $${fees}</p>
  <p>Please choose one of the following options:</p>
  <p><a href="${approvalUrl}" style="padding: 10px; background-color: green; color: white; text-decoration: none;">Approve</a></p>
  <br/>
  <p><a href="${declineUrl}" style="padding: 10px; background-color: red; color: white; text-decoration: none;">Decline</a></p>
`;

    await sendEmail(
      'New Job Request - Please Respond',
      emailMessage,
      helper.email,
      'no-reply@hireme.com',
    );

    res.status(200).json({ message: 'Request sent to the helper. They will respond soon.' });
  } catch (error) {
    console.error('Error sending email or creating notification:', error);
    res.status(500).json({ message: 'Failed to send request or create notification.' });
  }
});


const jobApproval = async (req, res) => {
  const { email } = req.query; // Get user email from the query parameters

  if (!email) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // Fetch the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = user.email;
    console.log('User Email: ', userEmail);

    // Find the most recent notification for the user that is pending
    const notification = await Notification.findOne({
      userEmail: userEmail,
      taskStatus: 'pending' // Assuming you want to approve the most recent pending task
    }).sort({ createdAt: -1 }); // Sort by creation date, most recent first

    if (!notification) {
      return res.status(404).json({ message: 'No pending notifications found' });
    }

    // Update the notification with "accepted" status
    await Notification.findByIdAndUpdate(notification._id, {
      taskStatus: 'accepted',
      message: `Your job has been accepted. Please proceed with the payment.`,
    });

    res.send('Job approved, notification updated for user.');
  } catch (error) {
    console.error('Error approving job:', error);
    res.status(500).send('Error approving job.');
  }
};




const jobDecline = async (req, res) => {
  const { email } = req.query; // Get user email from the query parameters

  if (!email) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // Fetch the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = user.email;
    console.log('User Email: ', userEmail);

    // Find the most recent notification for the user that is pending
    const notification = await Notification.findOne({
      userEmail: userEmail,
      taskStatus: 'pending' // Assuming you want to decline the most recent pending task
    }).sort({ createdAt: -1 }); // Sort by creation date, most recent first

    if (!notification) {
      return res.status(404).json({ message: 'No pending notifications found' });
    }

    // Update the notification with "declined" status
    await Notification.findByIdAndUpdate(notification._id, {
      taskStatus: 'declined',
      message: 'Your job has been declined.',
    });

    res.send('Job declined, notification updated for user.');
  } catch (error) {
    console.error('Error declining job:', error);
    res.status(500).send('Error declining job.');
  }
};


module.exports = {
  getHelpers,
  contactHelper,
  jobApproval,
  jobDecline
};