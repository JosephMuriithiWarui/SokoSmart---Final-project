const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmerModel');

const router = express.Router();

// Register a farmer
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, location, password } = req.body;

        // Check if farmer already exists
        const existingFarmer = await Farmer.findOne({ email });
        if (existingFarmer) {
            return res.status(400).json({ message: 'Farmer already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create farmer
        const farmer = new Farmer({ 
            name, 
            phone, 
            email, 
            location, 
            password: hashedPassword 
        });

        // Save farmer
        await farmer.save();
        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Login a farmer
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const farmer = await Farmer.findOne({ email });
        if (!farmer) {
            return res.status(400).json({ message: 'Farmer not found' });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, farmer.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate token
        const token = jwt.sign({ 
            id: farmer._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

