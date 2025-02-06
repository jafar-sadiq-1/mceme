const mongoose = require("mongoose");

const FDRSchema = new mongoose.Schema({
  fdrNo: { type: String, required: true, unique: true },
  dateOfDeposit: { type: Date, required: true },
  amount: { type: Number, required: true },
  maturityValue: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
  duration: { type: String, required: true },
  intRate: { type: Number, required: true },
  interestAmount: { type: Number, required: true },
  bank: { type: String, required: true },
  remarks: { type: String, default: "" },
});

const FDR = mongoose.model("FDR", FDRSchema);

module.exports = FDR;
