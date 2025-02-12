const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    voucherType: { type: String, required: true },
    voucherNo: { type: Number, required: true },
    particulars: { type: String, required: true },
    customParticulars: { type: String },
    receiptType: { type: String, required: true },
    customReceiptType: { type: String },
    method: { type: String },
    receiptDescription: { type: String },
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    fdr: { type: Number, default: 0 },
    sydr: { type: Number, default: 0 },
    sycr: { type: Number, default: 0 },
    property: { type: Number, default: 0 },
    eme_journal_fund: { type: Number, default: 0 },
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
receiptSchema.pre('save', function (next) {
  const receipt = this;
  const date = new Date(receipt.date);
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();
  
  // Set financial year based on April-March cycle
  const startYear = month <= 3 ? year - 1 : year;
  receipt.financialYear = `FY${startYear}-${startYear + 1}`;
  receipt.month = date.toLocaleString('default', { month: 'long' });
  
  next();
});

// Update middleware to handle updates
receiptSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
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
receiptSchema.index(
  { voucherType: 1, voucherNo: 1, financialYear: 1 },
  { 
    unique: true,
    name: 'unique_voucher_index'
  }
);

module.exports = receiptSchema;
