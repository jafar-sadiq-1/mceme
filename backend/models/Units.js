const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
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
  }
});

const Units = mongoose.model('Units', unitSchema);

module.exports = Units;
