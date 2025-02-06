const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    designation: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    toggler: { type: String, required: true, default: "Viewer" }, // Default role
  },
  { collection: 'all_users' }
);

module.exports = mongoose.model('all_users', UserSchema); // ✅ Use 'User' instead of 'all_users'
