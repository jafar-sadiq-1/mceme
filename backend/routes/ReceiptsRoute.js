const express = require("express");
const router = express.Router();
const receiptSchema = require("../models/Receipts");
const Unit = require("../models/Units");  // Add this import
const { getConnection } = require("../config/dbManager");

// Middleware to setup database connection based on financial year
const setupDbConnection = async (req, res, next) => {
  try {
    let financialYear = req.query.year || req.body.financialYear;

    // Validate financial year format
    const fyPattern = /^FY\d{4}-\d{4}$/;
    if (!fyPattern.test(financialYear)) {
      return res.status(400).json({ 
        message: "Invalid financial year format", 
        error: "Year must be in format FY2024-2025" 
      });
    }

    console.log('Connecting to DB for year:', financialYear); // Debug log

    // Get connection for the specific financial year
    const connection = await getConnection(financialYear);
    if (!connection) { 
      throw new Error(`Failed to get connection for ${financialYear}`);
    }

    req.ReceiptModel = connection.model('Receipt', receiptSchema);
    next();
  } catch (error) {
    console.error('DB Connection Error:', error);
    res.status(500).json({ 
      message: "Database connection error", 
      error: error.message,
      year: req.query.year || req.body.financialYear 
    });
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
    
    // Find the receipt first to ensure it exists
    const existingReceipt = await req.ReceiptModel.findOne({ 
      voucherType, 
      voucherNo: Number(voucherNo) 
    });

    if (!existingReceipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Prepare update data with proper number conversions
    const cleanedUpdateData = {
      ...updateData,
      voucherNo: Number(voucherNo),
      date: new Date(updateData.date),
      cash: Number(updateData.cash || 0),
      bank: Number(updateData.bank || 0),
      fdr: Number(updateData.fdr || 0),
      sydr: Number(updateData.sydr || 0),
      sycr: Number(updateData.sycr || 0),
      property: Number(updateData.property || 0),
      eme_journal_fund: Number(updateData.eme_journal_fund || 0),
      counterVoucherNo: Number(updateData.counterVoucherNo || 0)
    };

    // Update the receipt with the new data
    const updatedReceipt = await req.ReceiptModel.findOneAndUpdate(
      { 
        voucherType, 
        voucherNo: Number(voucherNo) 
      },
      cleanedUpdateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    console.log('Updated receipt:', updatedReceipt); // For debugging

    res.json({ 
      message: 'Receipt updated successfully', 
      receipt: updatedReceipt 
    });
  } catch (error) {
    console.error('Update error:', error); // For debugging
    res.status(500).json({ 
      message: 'Error updating receipt', 
      error: error.message 
    });
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
