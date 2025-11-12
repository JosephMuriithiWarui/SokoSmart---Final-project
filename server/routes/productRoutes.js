const express = require('express');

const Product = require('../models/productModel');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Public: View all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name location phone');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Farmer Only: Add product
router.post('/', protect(['farmer']), async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;
    const product = new Product({
      name,
      price,
      category,
      quantity,
      farmer: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Farmer Only: Update/Delete only their products
router.put('/:id', protect(['farmer']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(product, req.body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect(['farmer']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
