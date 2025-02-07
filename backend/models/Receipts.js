const mongoose = require('mongoose');

// Receipt Schema
const receiptSchema = new mongoose.Schema(
  {
    rv: { type: String, required: true }, // RV as String
    rvNo: { 
      type: Number,
      required: function() {
        return this.rv !== 'BBF'; // rvNo is required only when rv is not BBF
      }
    },
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

// Ensure indexes are properly created
receiptSchema.pre('save', function (next) {
  const receipt = this;
  
  // Set year and month based on the date
  const date = new Date(receipt.date);
  receipt.year = date.getFullYear();
  receipt.month = date.toLocaleString('default', { month: 'long' });
  
  next();
});

// Create and export the Receipt model
const Receipt = mongoose.model('Receipt', receiptSchema);

// Function to initialize indexes
async function initializeIndexes() {
  try {
    // Drop all existing indexes except _id
    await Receipt.collection.dropIndexes();
    
    // Create the new compound index
    await Receipt.collection.createIndex(
      { year: 1, rv: 1, rvNo: 1 },
      { 
        unique: true,
        name: 'unique_year_rv_rvno',
        background: true,
        partialFilterExpression: { rvNo: { $exists: true } } // Match the payments model exactly
      }
    );
    console.log('Indexes recreated successfully');
  } catch (error) {
    console.error('Error initializing indexes:', error);
  }
}

// Initialize indexes when the model is first loaded
initializeIndexes();

module.exports = Receipt;
