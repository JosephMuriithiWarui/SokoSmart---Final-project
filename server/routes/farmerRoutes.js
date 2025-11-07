const express = require('express');
const Farmer = require('../models/farmerModel');

const router = express.Router();

// Get all farmers
router.get('/', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json(farmers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a farmer by id
router.get('/:id', async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        res.status(200).json(farmer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a farmer
router.post('/', async (req, res) => {
    const { name, phone, email, location, password } = req.body;
    const farmer = new Farmer({ name, phone, email, location, password });
    try {
        await farmer.save();
        res.status(201).json(farmer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a farmer
router.put('/:id', async (req, res) => {
    const { name, phone, email, location, password } = req.body;
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { name, phone, email, location, password }, { new: true });
        res.status(200).json(farmer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a farmer
router.delete('/:id', async (req, res) => {
    try {
        await Farmer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Farmer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;