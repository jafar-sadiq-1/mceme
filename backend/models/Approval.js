const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema(
  {
    requestFrom: { type: String, required: true },
    requestOn: { type: String, required: true },
    requestType: { type: String, required: true },
    requestDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    details: { type: Object, required: true }
  },
  { collection: 'approvals' }
);

module.exports = mongoose.model('approvals', ApprovalSchema);
