const express = require('express');
const UserApproval = require('../models/UserApproval');  // Use correct model name here
const router = express.Router();

// Route to get all user approval data
router.get('/user_approvals', async (req, res) => {
  try {
    const users = await UserApproval.find(); // Fetch all user approval data
    res.json(users); // Send the data as a response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approval users.', error: err.message });
  }
});

router.post('/signup', async (req, res) => {
  const { firstName, middleName, lastName, designation, mobileNumber, email, username, password,  approvalStatus } = req.body;

  try {
    const newUser = new UserApproval({ firstName, middleName, lastName, designation, mobileNumber, email, username, password });
    await newUser.save();
    res.json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user.', error: err.message });
  }
});


router.delete("/delete_approval/:id", async (req, res) => {
  const result = await UserApproval.findByIdAndDelete(req.params.id);
  res.json(result ? { message: "Deleted" } : { error: "Not found" });
});


module.exports = router;