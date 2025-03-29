const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const BBFSchema = require('../models/bbf');

// Create BBF model
const BBF = mongoose.model('BBF', BBFSchema);

// GET BBF values
router.get('/', async (req, res) => {
    try {
        let { financialYear, month, type } = req.query;
        
        console.log('Raw BBF Request:', req.query);
console.log(financialYear, month, type)
        // Validate inputs
        if (!financialYear || !month || !type) {
            console.log('Missing required parameters');
            return res.status(400).json({
                message: 'Missing required parameters',
                required: { financialYear, month, type }
            });
        }

        // Clean parameters
        financialYear = financialYear.trim().replace('FY', '');
        month = month.trim();
        type = type.trim().toLowerCase();
        console.log(financialYear, month, type)

        console.log('Cleaned BBF params:', { 
            financialYear: `FY${financialYear}`, 
            month, 
            type 
          });
          

          const bbf = await BBF.findOne({
            financialYear: `FY${financialYear}`, // Ensure this matches your database field name
            month,
            type
        }).lean();
        
console.log("bbf bolthey",bbf)
        console.log('BBF from database:', bbf);

        res.json(bbf || {
            cash: 0,
            bank: 0,
            fdr: 0,
            sydr: 0,
            sycr: 0,
            property: 0,
            eme_journal_fund: 0
        });
    } catch (error) {
        console.error('BBF Error:', error);
        res.status(500).json({
            message: 'Error fetching BBF data',
            error: error.message
        });
    }
});

// POST/UPDATE BBF values
router.post('/', async (req, res) => {
    try {
        const { type, financialYear, month, ...bbfData } = req.body;
        const cleanFinancialYear = financialYear.replace('FY', '');

        const bbf = await BBF.findOneAndUpdate(
            { 
                type, 
                financialYear: cleanFinancialYear, 
                month 
            },
            {
                ...bbfData,
                lastUpdated: Date.now()
            },
            { new: true, upsert: true }
        );

        res.status(201).json(bbf);
    } catch (error) {
        res.status(500).json({
            message: 'Error saving BBF data',
            error: error.message
        });
    }
});

// Initialize BBF
router.post('/add', async (req, res) => {
    try {
        const { financialYear, month, type } = req.body;
        const cleanFinancialYear = financialYear.replace('FY', '');

        const existingBBF = await BBF.findOne({ 
            financialYear: cleanFinancialYear, 
            month, 
            type 
        });

        if (existingBBF) {
            return res.status(400).json({
                message: 'BBF already exists for this period'
            });
        }

        const newBBF = new BBF({
            type,
            financialYear: cleanFinancialYear,
            month,
            cash: 0,
            bank: 0,
            fdr: 0,
            sydr: 0,
            sycr: 0,
            property: 0,
            eme_journal_fund: 0,
            lastUpdated: Date.now()
        });

        await newBBF.save();
        res.status(201).json(newBBF);
    } catch (error) {
        res.status(500).json({
            message: 'Error initializing BBF',
            error: error.message
        });
    }
});

module.exports = router;
