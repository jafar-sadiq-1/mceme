const mongoose = require('mongoose');

const financialYearSchema = new mongoose.Schema({
  financialYear: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^FY\d{4}-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid financial year format! Use format: FY2024-2025`
    }
  }
}, {
  timestamps: true
});

const FinancialYear = mongoose.model('FinancialYear', financialYearSchema);

module.exports = FinancialYear;
