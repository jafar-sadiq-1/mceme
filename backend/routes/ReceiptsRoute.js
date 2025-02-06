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

    // Create a new receipt
    const newReceipt = new Receipt({
      rv,
      rvNo,
      date,
      particulars,
      cash,
      bank,
      fdr,
      syDr,
      syCr,
      property,
      emeJournalFund
    });

    // Save the receipt to the database
    await newReceipt.save();

    // Send success response
    res.status(201).json({
      message: "Receipt created successfully",
      receipt: newReceipt
    });
  } catch (error) {
    console.error("Error creating receipt:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/receipts
// @desc    Delete a receipt based on year, rv, and rvNo
router.delete("/", async (req, res) => {
  console.log("Delete Request")
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
    console.log(req.body);
    const { year, month, rv, rvNo, ...updateData } = req.body;
    // Find the receipt to update
    const receipt = await Receipt.findOne({ year, rv, rvNo });

    console.log(receipt);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Update the fields
    Object.keys(updateData).forEach((key) => {
      receipt[key] = updateData[key];
    });

    // Save the updated receipt
    await receipt.save();

    res.json({ message: 'Receipt updated successfully', receipt });
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;