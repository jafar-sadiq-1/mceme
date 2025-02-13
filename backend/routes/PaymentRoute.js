const express = require("express");
const router = express.Router();
const Payment = require("../models/Payments");

// @route   GET /api/receipts
// @desc    Get receipts (filtered by year and month if provided)
router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;
    let filter = {};

    if (year) filter.year = parseInt(year);
    if (month) filter.month = month;

    const payments = await Payment.find(filter).sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Destructure fields from the request body
    const { pv, pvNo, date, particulars, cash, bank, fdr, syDr, syCr, property, emeJournalFund } = req.body;

    // Check for required pvNo when pv is not BBF
    if (pv !== 'BBF' && !pvNo) {
      return res.status(400).json({ 
        message: "PV Number is required for non-BBF entries" 
      });
    }

    // Create a new receipt
    const newPayment = new Payment({
      pv,
      pvNo: Number(pvNo), // Ensure pvNo is a number
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

    // Save the receipt to the database
    try {
      await newPayment.save();
      
      // Send success response
      res.status(201).json({
        message: "Payment created successfully",
        payment: newPayment
      });
    } catch (saveError) {
      console.error("Save Error Details:", {
        code: saveError.code,
        keyPattern: saveError.keyPattern,
        keyValue: saveError.keyValue
      });

      if (saveError.code === 11000) {
        const keyValue = saveError.keyValue || {};
        return res.status(400).json({ 
          message: `A payment with PV type ${keyValue.pv || pv} and number ${keyValue.pvNo || pvNo} already exists for year ${keyValue.year || new Date(date).getFullYear()}`
        });
      }
      throw saveError;
    }
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      details: error.code === 11000 ? error.keyValue : undefined
    });
  }
});

// @route   DELETE /api/receipts
// @desc    Delete a receipt based on year, rv, and rvNo
router.delete("/", async (req, res) => {
  try {
    const { year, pv, pvNo } = req.query;

    if (!year || !pv || !pvNo) {
      return res.status(400).json({ message: "Missing required parameters: year, pv, or pvNo" });
    }

    // Find and delete the receipt matching year, rv, and rvNo
    const deletedPayment = await Payment.findOneAndDelete({ year, pv, pvNo });

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      message: "Payment deleted successfully",
      payment: deletedPayment,
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/', async (req, res) => {
  try {
    const { year, month, pv, pvNo, ...updateData } = req.body;
    // Find the receipt to update
    const payment = await Payment.findOne({ year, pv, pvNo });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update the fields
    Object.keys(updateData).forEach((key) => {
      payment[key] = updateData[key];
    });

    // Save the updated receipt
    await payment.save();

    res.json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;