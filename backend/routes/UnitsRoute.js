const express = require("express");
const router = express.Router();
const Unit = require("../models/Units");

// Create a New Unit
router.post("/add", async (req, res) => {
  try {
    const {
      ledgerPageNumber,
      nameOfUnit,
      amount,
      command,
      currentFinancialYear,
      currentFinancialAmount,
      lastFinancialYearAmount,
      unpaidAmount,
      advanceAmount  // Added new field
    } = req.body;

    // Validate required numeric fields
    const numericFields = {
      ledgerPageNumber,
      amount,
      currentFinancialAmount,
      lastFinancialYearAmount,
      unpaidAmount,
      advanceAmount  // Added new field
    };

    for (const [field, value] of Object.entries(numericFields)) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return res.status(400).json({ error: `Invalid input: ${field} must be a number` });
      }
    }

    // Create a new unit with all fields
    const newUnit = new Unit({
      ledgerPageNumber: Number(ledgerPageNumber),
      nameOfUnit,
      amount: Number(amount),
      command,
      currentFinancialYear,
      currentFinancialAmount: Number(currentFinancialAmount),
      lastFinancialYearAmount: Number(lastFinancialYearAmount),
      unpaidAmount: Number(unpaidAmount),
      advanceAmount: Number(advanceAmount),  // Added new field
      history: [] // Initialize empty history array
    });

    await newUnit.save();
    res.status(201).json({ message: "Unit added successfully!", newUnit });
  } catch (error) {
    res.status(500).json({ error: "Error adding unit: " + error.message });
  }
});

// Get All Units
router.get("/", async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ error: "Error fetching units: " + error.message });
  }
});

// Update a Unit by nameOfUnit
router.put("/update/:nameOfUnit", async (req, res) => {
  try {
    const {
      ledgerPageNumber,
      amount,
      command,
      currentFinancialAmount,
      lastFinancialYearAmount,
      unpaidAmount,
      advanceAmount  // Added new field
    } = req.body;

    const nameOfUnit = req.params.nameOfUnit;

    // Create update object with all fields
    const updateData = {
      ledgerPageNumber: Number(ledgerPageNumber),
      amount: Number(amount),
      command,
      currentFinancialAmount: Number(currentFinancialAmount),
      lastFinancialYearAmount: Number(lastFinancialYearAmount),
      unpaidAmount: Number(unpaidAmount),
      advanceAmount: Number(advanceAmount)  // Added new field
    };

    const updatedUnit = await Unit.findOneAndUpdate(
      { nameOfUnit },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.status(200).json({ message: "Unit updated successfully!", updatedUnit });
  } catch (error) {
    res.status(500).json({ error: "Error updating unit: " + error.message });
  }
});

router.delete("/delete/:unitName", async (req, res) => {
  try {
    const unitName = req.params.unitName;

    const deletedUnit = await Unit.findOneAndDelete({ nameOfUnit: unitName }); // Ensure the field name matches your schema

    if (!deletedUnit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.status(200).json({ message: "Unit deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting unit: " + error.message });
  }
});

module.exports = router;
