const mongoose = require('mongoose');

// Receipt Schema
const receiptSchema = new mongoose.Schema(
  {
    rv: { type: String, required: true }, // RV as String
    rvNo: { type: Number, required: true }, // RV Number as Number
    date: { type: Date, required: true },
    particulars: { type: String, required: true },
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    fdr: { type: Number, default: 0 },
    syDr: { type: Number, default: 0 },
    syCr: { type: Number, default: 0 },
    property: { type: Number, default: 0 },
    emeJournalFund: { type: Number, default: 0 },
    year: { type: Number },
    month: { type: String },
  },
  { timestamps: true }
);

// Middleware to set year and month based on the date before saving
receiptSchema.pre('save', function (next) {
  const receipt = this;

  // Set year and month based on the date
  const date = new Date(receipt.date);
  receipt.year = date.getFullYear(); // Set the year
  receipt.month = date.toLocaleString('default', { month: 'long' }); // Set the month

  next();
});

// Create and export the Receipt model
const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
