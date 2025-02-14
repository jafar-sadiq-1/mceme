const express = require("express");
const router = express.Router();
const paymentSchema = require("../models/Payments");
const { getConnection } = require("../config/dbManager");
const { getFinancialYear } = require("../utils/financialYearHelper"); // Fixed import path

// Middleware to setup database connection based on financial year
const setupDbConnection = async (req, res, next) => {
  try {
    let financialYear;
    
    // Get financial year from query params
    if (req.query.year) {
      financialYear = req.query.year;
    }
    // Or from request body
    else if (req.body.financialYear) {
      financialYear = req.body.financialYear;
    }
    // Or calculate from date
    else if (req.body.date) {
      const date = new Date(req.body.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const startYear = month <= 3 ? year - 1 : year;
      financialYear = `FY${startYear}-${startYear + 1}`;
    }

    if (!financialYear) {
      return res.status(400).json({ message: "Financial year is required" });
    }

    // Get connection for the specific financial year
    const connection = await getConnection(financialYear);
    req.PaymentModel = connection.model('Payment', paymentSchema);
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection error", error: error.message });
  }
};

// Apply middleware to all routes
router.use(setupDbConnection);

// GET route
router.get("/", async (req, res) => {
  try {
    const { month } = req.query;
    let filter = {};
    
    if (month) {
      filter.month = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
    }
    const payments = await req.PaymentModel.find(filter).sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message
    });
  }
});

// GET last voucher number for a specific type
router.get("/lastVoucherNo", async (req, res) => {
  try {
    const { voucherType } = req.query;
    
    if (!voucherType) {
      return res.status(400).json({ message: "Voucher type is required" });
    }

    const lastPayment = await req.PaymentModel.findOne(
      { voucherType },              // Changed from pv
      { voucherNo: 1 },            // Changed from pvNo
      { sort: { voucherNo: -1 } }  // Changed from pvNo
    );

    res.json({ 
      lastVoucherNo: lastPayment ? lastPayment.voucherNo : 0 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching last voucher number", 
      error: error.message 
    });
  }
});

// POST route
router.post("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, date, particulars, cash, bank, fdr, syDr, syCr, property, emeJournalFund } = req.body;

    if (voucherType !== 'BBF' && !voucherNo) {
      return res.status(400).json({ message: "Voucher Number is required for non-BBF entries" });
    }

    const newPayment = new req.PaymentModel({
      voucherType,          // Changed from pv
      voucherNo: Number(voucherNo),  // Changed from pvNo
      date,
      particulars,
      cash: Number(cash) || 0,
      bank: Number(bank) || 0,
      fdr: Number(fdr) || 0,
      syDr: Number(syDr) || 0,
      syCr: Number(syCr) || 0,
      property: Number(property) || 0,
      emeJournalFund: Number(emeJournalFund) || 0
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE route
router.delete("/", async (req, res) => {
  try {
    const { voucherType, voucherNo } = req.query;  // Changed from pv, pvNo

    if (!voucherType || !voucherNo) {
      return res.status(400).json({ message: "Missing required parameters: voucherType or voucherNo" });
    }

    const deletedPayment = await req.PaymentModel.findOneAndDelete({ voucherType, voucherNo });

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully", payment: deletedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
});

// UPDATE route
router.put("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, ...updateData } = req.body;  // Changed from pv, pvNo
    const payment = await req.PaymentModel.findOneAndUpdate(
      { voucherType, voucherNo },
      updateData,
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment updated successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
});

module.exports = router;