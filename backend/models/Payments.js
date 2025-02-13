const mongoose = require('mongoose');

// Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    voucherType: { type: String, required: true },
    voucherNo: { type: Number, required: true },
    particulars: { type: String, required: true },
    customParticulars: { type: String },
    paymentType: { type: String, required: true },
    customPaymentType: { type: String },
    method: { type: String },
    paymentDescription: { type: String },
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    fdr: { type: Number, default: 0 },
    syDr: { type: Number, default: 0 },
    syCr: { type: Number, default: 0 },
    property: { type: Number, default: 0 },
    emeJournalFund: { type: Number, default: 0 },
    financialYear: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^FY\d{4}-\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid financial year format (FY2024-2025)!`
      }
    },
    month: { type: String }
  },
  { timestamps: true }
);

// Middleware to set financial year and month before saving
paymentSchema.pre('save', function (next) {
  const payment = this;
  const date = new Date(payment.date);
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();
  
  // Set financial year based on April-March cycle
  const startYear = month <= 3 ? year - 1 : year;
  payment.financialYear = `FY${startYear}-${startYear + 1}`;
  payment.month = date.toLocaleString('default', { month: 'long' });
  
  next();
});

// Update middleware to handle updates
paymentSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  if (update.date) {
    const date = new Date(update.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const startYear = month <= 3 ? year - 1 : year;
    
    update.financialYear = `FY${startYear}-${startYear + 1}`;
    update.month = date.toLocaleString('default', { month: 'long' });
  }
  next();
});

// Compound index on voucherType and voucherNo within each financial year
paymentSchema.index(
  { voucherType: 1, voucherNo: 1, financialYear: 1 },
  { 
    unique: true,
    name: 'unique_voucher_index'
  }
);

module.exports = paymentSchema;
