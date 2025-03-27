const express = require("express");
const router = express.Router();
const FinancialYear = require("../models/FinancialYears");

// POST route to add a new financial year
router.post("/", async (req, res) => {
  try {
    const { financialYear } = req.body;

    if (!financialYear) {
      return res.status(400).json({ message: "Financial year is required" });
    }

    const newFinancialYear = new FinancialYear({ financialYear });
    const savedFinancialYear = await newFinancialYear.save();

    res.status(201).json({
      message: "Financial year added successfully",
      financialYear: savedFinancialYear
    });
  } catch (error) {
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ message: "Financial year already exists" });
    }
    res.status(500).json({ message: "Error adding financial year", error: error.message });
  }
});

// GET route to fetch all financial years
router.get("/", async (req, res) => {
  try {
    const financialYears = await FinancialYear.find().sort({ financialYear: -1 });
    res.json(financialYears);
  } catch (error) {
    res.status(500).json({ message: "Error fetching financial years", error: error.message });
  }
});

module.exports = router;
