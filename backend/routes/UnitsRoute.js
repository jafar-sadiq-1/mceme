const express = require("express");
const router = express.Router();
const Unit = require("../models/Units");

// Create a New Unit
router.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    // Convert ledgerPageNumber and amount to numbers
    const ledgerPageNumber = Number(req.body.ledgerPageNumber);
    const amount = Number(req.body.amount);
    const { nameOfUnit, command } = req.body;

    // Check if conversion failed (NaN) and return an error
    if (isNaN(ledgerPageNumber) || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid input: ledgerPageNumber and amount must be numbers" });
    }

    // Create a new unit
    const newUnit = new Unit({ ledgerPageNumber, nameOfUnit, amount, command });
    // console.log(newUnit);

    // Save the new unit to the database
    await newUnit.save();
    // console.log(newUnit);

    // Respond with success
    res.status(201).json({ message: "Unit added successfully!", newUnit });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: "Error adding unit: " + error.message });
  }
});


// Get All Units
router.get("/", async (req, res) => {
  try {
    const units = await Unit.find();
    // console.log(units); // Log the data being returned
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ error: "Error fetching units: " + error.message });
  }
});


// Update a Unit by unitName
// Update a Unit by nameOfUnit
router.put("/update/:nameOfUnit", async (req, res) => {
  try {
    // Extract data from the request body
    const ledgerPageNumber = Number(req.body.ledgerPageNumber);
    const amount = Number(req.body.amount);
    const { command } = req.body; // Correct field name 'command'
    const nameOfUnit = req.params.nameOfUnit; // Extract nameOfUnit from URL parameter

    // console.log(nameOfUnit, typeof(nameOfUnit));
    // console.log(ledgerPageNumber,typeof(ledgerPageNumber));
    // console.log(amount,typeof(amount));
    // console.log(command,typeof(command));
    // Log the received request body for debugging purposes
    // console.l/og("Body:",req.body);

    // Perform the update
    const updatedUnit = await Unit.findOneAndUpdate(
      { nameOfUnit }, // Find by nameOfUnit instead of unitName
      { ledgerPageNumber, amount, command }, // Update the unit fields
      { new: true } // Return the updated document
    );

    // console.log("Hello",updatedUnit);

    // Check if the unit was found and updated
    if (!updatedUnit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    // Send success response
    res.status(200).json({ message: "Unit updated successfully!", updatedUnit });
  } catch (error) {
    // Handle errors
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
