const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipts");

// @route   GET /api/receipts
// @desc    Get receipts (filtered by year and month if provided)
router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;
    let filter = {};

    if (year) filter.year = parseInt(year);
    if (month) filter.month = month;

    const receipts = await Receipt.find(filter).sort({ date: -1 });
    res.json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Destructure fields from the request body
    const { rv, rvNo, date, particulars, cash, bank, fdr, syDr, syCr, property, emeJournalFund } = req.body;

    // Check for required rvNo when rv is not BBF
    if (rv !== 'BBF' && !rvNo) {
      return res.status(400).json({ 
        message: "RV Number is required for non-BBF entries" 
      });
    }

    // Create a new receipt
    const newReceipt = new Receipt({
      rv,
      rvNo: Number(rvNo), // Ensure rvNo is a number
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
      await newReceipt.save();
      
      // Send success response
      res.status(201).json({
        message: "Receipt created successfully",
        receipt: newReceipt
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
          message: `A receipt with RV type ${keyValue.rv || rv} and number ${keyValue.rvNo || rvNo} already exists for year ${keyValue.year || new Date(date).getFullYear()}`
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
    const { year, rv, rvNo } = req.query;

    if (!year || !rv || !rvNo) {
      return res.status(400).json({ message: "Missing required parameters: year, rv, or rvNo" });
    }

    // Find and delete the receipt matching year, rv, and rvNo
    const deletedReceipt = await Receipt.findOneAndDelete({ year, rv, rvNo });

    if (!deletedReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json({
      message: "Receipt deleted successfully",
      receipt: deletedReceipt,
    });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/', async (req, res) => {
  try {
    const { year, rv, rvNo, ...updateData } = req.body;
    
    // Find the receipt to update
    const receipt = await Receipt.findOne({ year, rv, rvNo });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Update the fields
    Object.keys(updateData).forEach((key) => {
      if (typeof updateData[key] === 'number') {
        receipt[key] = Number(updateData[key]) || 0;
      } else {
        receipt[key] = updateData[key];
      }
    });

    await receipt.save();

    res.json({
      message: 'Receipt updated successfully',
      receipt
    });
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;