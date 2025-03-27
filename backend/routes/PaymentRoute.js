const express = require("express");
const router = express.Router();
const paymentSchema = require("../models/Payments");
const FinancialYear = require("../models/FinancialYears"); // Add this import
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
    const { year, month } = req.query;
    let filter = {};
    
    // Add year to filter if provided
    if (year) {
      filter.financialYear = year;
    }

    // Add month filter if provided
    if (month) {
      // Month is already stored as full name in the database
      filter.month = month;
    }

    console.log('Applied filters:', filter); // Debug log

    const payments = await req.PaymentModel.find(filter).sort({ date: -1 });
    console.log(`Found ${payments.length} payments for ${month || 'all months'} in ${year}`); // Debug log

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

// POST route - Fix the undefined Payment reference
router.post("/", async (req, res) => {
  try {
    // Check if financial year exists and create if it doesn't
    const financialYear = req.body.financialYear || getFinancialYear(req.body.date);
    const existingFY = await FinancialYear.findOne({ financialYear });
    if (!existingFY) {
      await FinancialYear.create({ financialYear });
    }

    console.log('Received payment data:', req.body);
    
    // Ensure required fields
    const paymentData = {
      ...req.body,
      financialYear: req.body.financialYear || getFinancialYear(req.body.date),
      paymentType: req.body.paymentType || 'Counter Entry',
    };

    console.log('Processed payment data:', paymentData);

    // Use req.PaymentModel instead of Payment
    const newPayment = new req.PaymentModel(paymentData);
    const savedPayment = await newPayment.save();
    
    console.log('Saved payment:', savedPayment);
    res.status(201).json(savedPayment);
  } catch (error) {
      console.error('Payment creation error:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

// DELETE route
router.delete("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, year, isCounterVoucher } = req.query;

    console.log('Delete payment request params:', req.query);

    // Find payment to delete
    const query = {
      voucherType: voucherType,
      voucherNo: Number(voucherNo)
    };

    // Log the query being used
    console.log('Payment deletion query:', query);

    let paymentToDelete = await req.PaymentModel.findOne(query);
    
    if (!paymentToDelete) {
      console.log('No payment found with query:', query);
      return res.status(404).json({ 
        message: "No payment found to delete",
        query: query
      });
    }

    console.log('Found payment to delete:', paymentToDelete);

    // If it's a waveoff payment, handle unit updates
    if (paymentToDelete.paymentType === "Waveoff" && 
        paymentToDelete.particulars !== "Custom" && 
        !isCounterVoucher) {
      // ... existing waveoff handling code ...
    }

    // Delete the payment
    await req.PaymentModel.findByIdAndDelete(paymentToDelete._id);

    res.json({ 
      message: "Payment deleted successfully",
      deletedPayment: paymentToDelete
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ 
      message: "Error deleting payment", 
      error: error.message,
      stack: error.stack
    });
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
    res.status500.json({ message: "Error updating payment", error: error.message });
  }
});

module.exports = router;