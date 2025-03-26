const express = require("express");
const FDR = require("../models/FDRs");

const router = express.Router();

// 📌 1️⃣ Create a New FDR (POST)
router.post("/", async (req, res) => {
  try {
    const newFDR = new FDR(req.body);
    await newFDR.save();
    res.status(201).json(newFDR);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 2️⃣ Get All FDRs (GET)
router.get("/", async (req, res) => {
  try {
    const fdrs = await FDR.find();
    res.status(200).json(fdrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 3️⃣ Get an FDR by FDR No (GET)
router.get("/:fdrNo", async (req, res) => {
  try {
    const fdr = await FDR.findOne({ fdrNo: req.params.fdrNo });
    if (!fdr) return res.status(404).json({ message: "FDR not found" });
    res.status(200).json(fdr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 4️⃣ Update an FDR by FDR No (PUT)
router.put("/:fdrNo", async (req, res) => {
  try {
    const updatedFDR = await FDR.findOneAndUpdate(
      { fdrNo: req.params.fdrNo },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFDR) return res.status(404).json({ message: "FDR not found" });
    res.status(200).json(updatedFDR);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 5️⃣ Delete an FDR by FDR No (DELETE)
router.delete("/:fdrNo", async (req, res) => {
  try {
    const deletedFDR = await FDR.findOneAndDelete({ fdrNo: req.params.fdrNo });
    if (!deletedFDR) return res.status(404).json({ message: "FDR not found" });
    res.status(200).json({ message: "FDR deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
