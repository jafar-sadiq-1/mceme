const express = require("express");
const router = express.Router();
const paymentSchema = require("../models/Payments");
const { getConnection } = require("../config/dbManager");
const { getFinancialYear } = require("../utils/financialYearHelper"); // Fixed import path
const Unit = require("../models/Units");  // Add this import

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
    if (!date || !voucherType || !voucherNo || !paymentType || !particulars) {
      return res.status(400).json({ 
        message: "Required fields missing",
        required: ['date', 'voucherType', 'voucherNo', 'paymentType', 'particulars']
      });
    }

    // Create new payment with all fields
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

    const savedPayment = await newPayment.save();
    res.status(201).json({ message: "Payment created successfully", payment: savedPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

// DELETE route
router.delete("/", async (req, res) => {
  try {
    const { voucherType, voucherNo, year } = req.query;

    // Find all payments to delete (current and subsequent for PV)
    let paymentsToDelete = [];
    if (voucherType === 'PV') {
      paymentsToDelete = await req.PaymentModel.find({
        voucherType: 'PV',
        voucherNo: { $gte: Number(voucherNo) }
      }).sort({ voucherNo: 1 });
    } else {
      paymentsToDelete = [await req.PaymentModel.findOne({ voucherType, voucherNo })];
    }

    if (!paymentsToDelete.length) {
      return res.status(404).json({ message: "No payments found to delete" });
    }

    // Process each payment
    for (const payment of paymentsToDelete) {
      console.log('Processing payment:', payment);

      // Handle waveoff payments
      if (payment.paymentType === "Waveoff" && payment.particulars !== "Custom") {
        try {
          // Fetch the unit
          const unit = await Unit.findOne({ nameOfUnit: payment.particulars });
          if (!unit) {
            console.error(`Unit not found: ${payment.particulars}`);
            continue;
          }

          // Get the waveoff amount from the payment's method field
          const waveoffAmount = Number(payment[payment.method] || 0);
          console.log(`Waveoff amount to revert: ${waveoffAmount}`);

          // Update unit's unpaid amount
          unit.unpaidAmount += waveoffAmount;
          console.log(`Updated unpaid amount: ${unit.unpaidAmount}`);

          // Remove matching history entries
          const initialHistoryLength = unit.history.length;
          unit.history = unit.history.filter(h => 
            !(h.voucherType === payment.voucherType && 
              h.voucherNo === payment.voucherNo)
          );
          console.log(`Removed ${initialHistoryLength - unit.history.length} history entries`);

          // Save the updated unit
          await unit.save();
          console.log(`Unit ${unit.nameOfUnit} updated successfully`);
        } catch (unitError) {
          console.error('Error updating unit:', unitError);
        }
      }

      // Delete the payment
      await req.PaymentModel.findByIdAndDelete(payment._id);
    }

    res.json({ 
      message: "Payment(s) deleted successfully", 
      deletedCount: paymentsToDelete.length 
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ 
      message: "Error deleting payment(s)", 
      error: error.message 
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
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
});

module.exports = router;