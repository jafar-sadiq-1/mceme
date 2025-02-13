const express = require("express");
const router = express.Router();
const paymentSchema = require("../models/Payments");
const { getConnection } = require("../config/dbManager");

// Middleware to setup database connection based on financial year
const setupDbConnection = async (req, res, next) => {
  try {
    // Get financial year from query params, request body, or calculate from date
    let financialYear;

    if (req.query.year) {
      financialYear = req.query.year;
    } else if (req.body.financialYear) {
      financialYear = req.body.financialYear;
    } else if (req.body.date) {
      const date = new Date(req.body.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const startYear = month <= 3 ? year - 1 : year;
      financialYear = `FY${startYear}-${startYear + 1}`;
    }

    if (!financialYear) {
      return res.status(400).json({ message: "Financial year is required" });
    }
console.log(financialYear);
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

// POST route for adding new payment
router.post("/", async (req, res) => {
  console.log("Received request body:", req.body);  // Add this line for debugging
  try {
    const {
      date,
      voucherType,
      voucherNo,
      particulars,
      customParticulars,
      paymentType,
      customPaymentType,
      method,
      paymentDescription,
      cash,
      bank,
      fdr,
      syDr,
      syCr,
      property,
      emeJournalFund,
      financialYear
    } = req.body;

    // Validate required fields
    if (!date || !voucherType || !voucherNo) {
      return res.status(400).json({ 
        message: "Required fields missing",
        required: ['date', 'voucherType', 'voucherNo']
      });
    }

    // Create new payment
    const newPayment = new req.PaymentModel({
      date: new Date(date),
      voucherType,
      voucherNo: Number(voucherNo),
      particulars: particulars || customParticulars,
      paymentType: paymentType || customPaymentType,
      method,
      paymentDescription,
      cash: Number(cash) || 0,
      bank: Number(bank) || 0,
      fdr: Number(fdr) || 0,
      syDr: Number(syDr) || 0,
      syCr: Number(syCr) || 0,
      property: Number(property) || 0,
      emeJournalFund: Number(emeJournalFund) || 0,
      financialYear
    });

    console.log("Attempting to save payment:", newPayment); // Add this line for debugging
    const savedPayment = await newPayment.save();
    console.log("Payment saved successfully:", savedPayment); // Add this line for debugging
    
    res.status(201).json({ message: "Payment created successfully", payment: savedPayment });
  } catch (error) {
    console.error("Detailed error:", error); // Add this line for debugging
    res.status(500).json({ 
      message: "Error creating payment", 
      error: error.message,
      stack: error.stack 
    });
  }
});

// PUT route for updating payment
router.put("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, ...updateData } = req.body;
    
    const payment = await req.PaymentModel.findOneAndUpdate(
      { voucherType, voucherNo },
      updateData,
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
});

// DELETE route for deleting a payment
router.delete("/", async (req, res) => {
  console.log("Delete Request");
  try {
    const { voucherType, voucherNo } = req.query;
    console.log(voucherNo, typeof voucherNo);

    const deletedPayment = await req.PaymentModel.findOneAndDelete({ voucherType, voucherNo });

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully", payment: deletedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
});

// GET route with financial year and month filtering
router.get("/", async (req, res) => {
  try {
   
    const { month } = req.query;
    let filter = {};
    if (month) filter.month = month;

    const payments = await req.PaymentModel.find(filter).sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
});


/*
router.get("/", async (req, res) => {
  try {
    const { month } = req.query;
    let filter = {};
    if (month) filter.month = month;

    const receipts = await req.ReceiptModel.find(filter).sort({ date: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching receipts", error: error.message });
  }
}); */

module.exports = router;
