const express = require("express");
const router = express.Router();
const receiptSchema = require("../models/Receipts");
const Unit = require("../models/Units");  // Add this import
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

    // Get connection for the specific financial year
    const connection = await getConnection(financialYear);
    req.ReceiptModel = connection.model('Receipt', receiptSchema);
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection error", error: error.message });
  }
};

// Apply middleware to all routes
router.use(setupDbConnection);

// POST route for adding new receipt
router.post("/", async (req, res) => {
  console.log("Received request body:", req.body);  // Add this line for debugging
  try {
    const {
      date,
      voucherType,
      voucherNo,
      particulars,
      customParticulars,
      receiptType,
      customReceiptType,
      method,
      receiptDescription,
      cash,
      bank,
      fdr,
      sydr,
      sycr,
      property,
      eme_journal_fund,
      financialYear
    } = req.body;

    // Validate required fields
    if (!date || !voucherType || !voucherNo) {
      return res.status(400).json({ 
        message: "Required fields missing",
        required: ['date', 'voucherType', 'voucherNo']
      });
    }

    // Create new receipt
    const newReceipt = new req.ReceiptModel({
      date: new Date(date),
      voucherType,
      voucherNo: Number(voucherNo),
      particulars: particulars || customParticulars,
      receiptType: receiptType || customReceiptType,
      method,
      receiptDescription,
      cash: Number(cash) || 0,
      bank: Number(bank) || 0,
      fdr: Number(fdr) || 0,
      sydr: Number(sydr) || 0,
      sycr: Number(sycr) || 0,
      property: Number(property) || 0,
      eme_journal_fund: Number(eme_journal_fund) || 0,
      financialYear
    });

    console.log("Attempting to save receipt:", newReceipt); // Add this line for debugging
    const savedReceipt = await newReceipt.save();
    console.log("Receipt saved successfully:", savedReceipt); // Add this line for debugging
    
    res.status(201).json({ message: "Receipt created successfully", receipt: savedReceipt });
  } catch (error) {
    console.error("Detailed error:", error); // Add this line for debugging
    res.status(500).json({ 
      message: "Error creating receipt", 
      error: error.message,
      stack: error.stack 
    });
  }
});

// PUT route for updating receipt
router.put("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, ...updateData } = req.body;
    
    const receipt = await req.ReceiptModel.findOneAndUpdate(
      { voucherType, voucherNo },
      updateData,
      { new: true, runValidators: true }
    );

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({ message: 'Receipt updated successfully', receipt });
  } catch (error) {
    res.status(500).json({ message: 'Error updating receipt', error: error.message });
  }
});

// DELETE route
router.delete("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, year, particulars } = req.query;

    // If it's an RV, find all subsequent receipts to delete
    let receiptsToDelete = [];
    if (voucherType === 'RV') {
      receiptsToDelete = await req.ReceiptModel.find({
        voucherType: 'RV',
        voucherNo: { $gte: Number(voucherNo) }
      });
    } else {
      receiptsToDelete = [await req.ReceiptModel.findOne({ voucherType, voucherNo })];
    }

    if (!receiptsToDelete.length) {
      return res.status(404).json({ message: "No receipts found to delete" });
    }

    // Process each receipt
    for (const receipt of receiptsToDelete) {
      // Skip if receipt is for custom particulars
      if (receipt.particulars !== 'Custom') {
        // Fetch the unit
        const unit = await Unit.findOne({ nameOfUnit: receipt.particulars });
        if (unit) {
          // Find all history entries with matching voucherType and voucherNo
          const historyEntries = unit.history.filter(
            h => h.voucherType === receipt.voucherType && h.voucherNo === receipt.voucherNo
          );

          // Process each matching history entry
          for (const historyEntry of historyEntries) {
            // Rollback the changes based on receiptFor
            switch (historyEntry.receiptFor) {
              case 'Advance Amount':
                unit.advanceAmount -= historyEntry.amount;
                break;
              case 'Current Financial Year Amount':
                unit.currentFinancialAmount += historyEntry.amount;
                break;
              case 'Last Financial Year Amount':
                unit.lastFinancialYearAmount += historyEntry.amount;
                break;
            }
          }

          // Remove all matching history entries
          unit.history = unit.history.filter(
            h => !(h.voucherType === receipt.voucherType && h.voucherNo === receipt.voucherNo)
          );

          // Save the updated unit
          await unit.save();
        }
      }

      // Delete the receipt
      await req.ReceiptModel.findByIdAndDelete(receipt._id);
    }

    res.json({ 
      message: "Receipt(s) deleted successfully", 
      deletedCount: receiptsToDelete.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting receipt(s)", 
      error: error.message 
    });
  }
});

// GET route with financial year and month filtering
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
});

// GET last voucher number for a specific type
router.get("/lastVoucherNo", async (req, res) => {
  try {
    const { voucherType } = req.query;
    
    if (!voucherType) {
      return res.status(400).json({ message: "Voucher type is required" });
    }

    const lastReceipt = await req.ReceiptModel.findOne(
      { voucherType },
      { voucherNo: 1 },
      { sort: { voucherNo: -1 } }
    );

    res.json({ 
      lastVoucherNo: lastReceipt ? lastReceipt.voucherNo : 0 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching last voucher number", 
      error: error.message 
    });
  }
});

module.exports = router;
