const express = require('express');
const Buyer = require('../models/buyerModel');

const router = express.Router();

// Get all buyers
router.get('/', async (req, res) => {
    try {
        const buyers = await Buyer.find();
        res.status(200).json(buyers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a buyer by id
router.get('/:id', async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);
        res.status(200).json(buyer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a buyer
router.put('/:id', async (req, res) => {
    try {
        const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }
        res.status(200).json(buyer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a buyer
router.post('/', async (req, res) => {
    const { name, phone, email } = req.body;
    const buyer = new Buyer({ name, phone, email });
    try {
        await buyer.save();
        res.status(201).json(buyer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a buyer
router.delete('/:id', async (req, res) => {
    try {
        await Buyer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Buyer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;