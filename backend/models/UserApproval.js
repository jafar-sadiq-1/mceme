const mongoose = require('mongoose');

const UserApprovalSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    designation: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    approvalStatus: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { collection: 'user_approvals' }
);

module.exports = mongoose.model('user_approvals', UserApprovalSchema);