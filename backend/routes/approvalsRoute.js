const express = require('express');
const Approval = require('../models/Approval');
const router = express.Router();

// Route to create a new approval
router.post('/', async (req, res) => {
  try {
    const { requestFrom, requestOn, requestType, details } = req.body;
    
    const newApproval = new Approval({
      requestFrom,
      requestOn,
      requestType,
      requestDate: new Date(),
      details
    });

    await newApproval.save();
    res.status(201).json({ message: 'Approval request created successfully', approval: newApproval });
  } catch (err) {
    res.status(500).json({ message: 'Error creating approval request', error: err.message });
  }
});

// Route to get all approvals
router.get('/', async (req, res) => {
  try {
    const approvals = await Approval.find();
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approvals', error: err.message });
  }
});

// Route to update approval status
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating approval:', { id, status }); // Debug log

    console.log('Updating approval:', { id, status }); // Debug log

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value. Must be "approved", "rejected", or "pending".' 
      });
    }

    const updatedApproval = await Approval.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedApproval) {
      console.log('Approval not found:', id); // Debug log
      return res.status(404).json({ message: 'Approval not found' });
    }

    console.log('Approval updated successfully:', updatedApproval); // Debug log

    res.status(200).json({
      success: true,
      message: 'Approval status updated successfully',
      approval: updatedApproval
    });

  } catch (err) {
    console.error('Error in update-status route:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating approval status',
      error: err.message 
    });
  }
});

module.exports = router;
