const mongoose = require('mongoose');

const BBFSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['receipt', 'payment'] },
    financialYear: { type: String, required: true },
    month: { type: String, required: true },
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    fdr: { type: Number, default: 0 },
    sydr: { type: Number, default: 0 },
    sycr: { type: Number, default: 0 },
    property: { type: Number, default: 0 },
    eme_journal_fund: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

// Add index for faster queries
BBFSchema.index({ financialYear: 1, month: 1, type: 1 }, { unique: true });

module.exports = BBFSchema;