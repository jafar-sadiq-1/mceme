const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  voucherType: {                // Changed from pv
    type: String,
    required: true
  },
  voucherNo: {                 // Changed from pvNo
    type: Number,
    required: function() { return this.voucherType !== 'BBF'; }
  },
  date: {
    type: Date,
    required: true
  },
  particulars: {
    type: String,
    required: true
  },
  cash: {
    type: Number,
    default: 0
  },
  bank: {
    type: Number,
    default: 0
  },
  fdr: {
    type: Number,
    default: 0
  },
  syDr: {
    type: Number,
    default: 0
  },
  syCr: {
    type: Number,
    default: 0
  },
  property: {
    type: Number,
    default: 0
  },
  emeJournalFund: {
    type: Number,
    default: 0
  },
  year: {
    type: Number
  },
  month: {
    type: String
  }
}, {
  timestamps: true
});

// Pre-save middleware to set month
paymentSchema.pre('save', function(next) {
  if (this.date) {
    this.month = new Date(this.date).toLocaleString('default', { month: 'long' });
  }
  next();
});

// Update compound index to use new field names
paymentSchema.index(
  { voucherType: 1, voucherNo: 1, financialYear: 1 },
  { unique: true }
);

module.exports = paymentSchema;
