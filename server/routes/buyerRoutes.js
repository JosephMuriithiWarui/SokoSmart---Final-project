const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Buyer = require('../models/buyerModel');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

//  Register a Buyer
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({ message: 'Buyer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const buyer = new Buyer({ name, email, phone, password: hashedPassword });
    await buyer.save();

    res.status(201).json({ message: 'Buyer registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Login Buyer
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await Buyer.findOne({ email });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: buyer._id, role: 'buyer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, buyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Get all buyers 
router.get('/', async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Get buyer by ID (protected — only that buyer can access)
router.get('/:id', protect(['buyer']), async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const buyer = await Buyer.findById(req.params.id);
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Update buyer
router.put('/:id', protect(['buyer']), async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Delete buyer 
router.delete('/:id', protect(['buyer']), async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Buyer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
