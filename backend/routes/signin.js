const express = require('express');
const User = require('../models/User');
const UserApproval =require('../models/UserApproval');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Signup Route
router.post('/add_users', async (req, res) => {
  const { firstName, middleName, lastName, designation, mobileNumber, email, username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Create new user
    const newUser = new User({ firstName, middleName, lastName, designation, mobileNumber, email, username, password ,toggler:"Viewer"});
    await newUser.save();

 

    // Send token in response
    res.json({
      message: 'User registered successfully!',
     // JWT token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error signing up user.', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const JWT_SECRET = 'secret_key';

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== password) return res.status(400).json({ message: 'Invalid password' });

    // Create payload for JWT token
    const payload = { username: user.username, designation: user.designation };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Send the token as a response
    const decoded = jwt.decode(token);

    if (decoded && decoded.exp) {
      console.log("Token expires at:", new Date(decoded.exp * 1000));
    } else {
      console.log("Token has no expiration field.");
    } 
    res.json({
      message: 'Login successful!',
      token, // JWT token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in.' });
  }

});

// View All Users Route
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users.', error: err.message });
  }
});

// Delete User Route
router.delete("/delete_user/:id", async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  res.json(result ? { message: "Deleted" } : { error: "Not found" });
});

router.put('/change_credentials/:oldUsername', async (req, res) => {
  const { newUsername, newPassword } = req.body;

  if (!newUsername || !newPassword) {
    return res.status(400).json({ message: 'Both new username and new password are required.' });
  }

  try {
    const result = await User.findOneAndUpdate(
      { username: req.params.oldUsername }, // Find user by old username
      { username: newUsername, password: newPassword }, // Update new username and password
      { new: true } // Return updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Username and password updated successfully.', user: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});

router.put("/update_toggler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { toggler } = req.body;

    // Update the toggler field in the user document
    const user = await User.findByIdAndUpdate(id, { toggler }, { new: true });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Toggler updated successfully", user });
  } catch (error) {
    console.error("Error updating toggler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
