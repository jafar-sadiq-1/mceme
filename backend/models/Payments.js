const mongoose = require('mongoose');

// Receipt Schema
const paymentSchema = new mongoose.Schema(
  {
    pv: { type: String, required: true }, // RV as String
    pvNo: { 
      type: Number,
      required: function() {
        return this.pv !== 'BBF'; // pvNo is required only when pv is not BBF
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
paymentSchema.pre('save', function (next) {
  const payment = this;
  
  // Set year and month based on the date
  const date = new Date(payment.date);
  payment.year = date.getFullYear();
  payment.month = date.toLocaleString('default', { month: 'long' });
  
  next();
});

// Create and export the Receipt model
const Payment = mongoose.model('Payment', paymentSchema);

// Function to initialize indexes
async function initializeIndexes() {
  try {
    // Drop all existing indexes except _id
    await Payment.collection.dropIndexes();
    
    // Create the new compound index
    await Payment.collection.createIndex(
      { year: 1, pv: 1, pvNo: 1 },
      { 
        unique: true,
        name: 'unique_year_pv_pvno',
        background: true,
        partialFilterExpression: { pv: { $ne: 'BBF' } }
      }
    );
    console.log('Indexes recreated successfully');
  } catch (error) {
    console.error('Error initializing indexes:', error);
  }
}

// Initialize indexes when the model is first loaded
initializeIndexes();

module.exports = Payment;
