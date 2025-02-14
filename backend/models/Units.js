const mongoose = require('mongoose');

// Create schema for history entries
const historyEntrySchema = new mongoose.Schema({
  financialYear: {
    type: String,
    required: true,
    match: /^FY\d{4}-\d{4}$/
  },
  dateReceived: {
    type: Date,
    required: true
  },
  voucherType: {
    type: String,
    required: true
  },
  voucherNo: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  typeOfVoucher: {
    type: String,
    required: true
  },
  receiptFor: {
    type: String,
    required: true
  }
}, { _id: false }); // Disable _id for subdocuments

const unitsSchema = new mongoose.Schema({
  // Existing fields
  ledgerPageNumber: {
    type: Number,
    required: true
  },
  nameOfUnit: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  command: {
    type: String,
    required: true
  },
  // New fields
  currentFinancialYear: {
    type: String,
    required: true,
    match: /^FY\d{4}-\d{4}$/
  },
  currentFinancialAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastFinancialYearAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  unpaidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  advanceAmount: {  // Added new field
    type: Number,
    default: 0,
    min: 0
  },
  history: [historyEntrySchema], // Array of history entries
}, {
  timestamps: true
});

// Single index for unique unit names
unitsSchema.index({ nameOfUnit: 1 }, { unique: true });

const Units = mongoose.model('Units', unitsSchema);

module.exports = Units;