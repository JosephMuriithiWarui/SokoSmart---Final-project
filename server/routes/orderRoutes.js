const express = require('express');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

 // Create a new order — only for buyers
 
router.post('/', protect(['buyer']), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Get the product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check stock
    if (product.quantity < quantity)
      return res.status(400).json({ message: 'Not enough stock available' });

    // Calculate total
    const totalPrice = product.price * quantity;

    // Create order
    const order = new Order({
      buyer: req.user.id,
      product: productId,
      quantity,
      totalPrice
    });

    // Save order
    await order.save();

    // Reduce product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


 // Get all orders for logged-in buyer

router.get('/my-orders', protect(['buyer']), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('product', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


 // Farmer: View all orders for their products

async function getFarmerOrders(req, res) {
  try {
    const farmerProducts = await Product.find({ farmer: req.user.id }).select('_id name price');
    if (farmerProducts.length === 0) {
      return res.status(200).json([]);
    }

    const productIds = farmerProducts.map((product) => product._id);

    const orders = await Order.find({ product: { $in: productIds } })
      .populate('product', 'name price')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

router.get('/farmer-orders', protect(['farmer']), getFarmerOrders);
router.get('/farmer', protect(['farmer']), getFarmerOrders);


  // Farmer: Update order status
 
router.put('/:id/status', protect(['farmer']), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure farmer owns the product in the order
    const product = await Product.findById(order.product).select('farmer');
    const productFarmerId = product && product['farmer'] ? String(product['farmer']) : null;
    if (!product || productFarmerId !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this order' });

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buyer: Cancel/Delete their own order
router.delete('/:id', protect(['buyer']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure buyer owns the order
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow canceling pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Restore product quantity
    const product = await Product.findById(order.product);
    if (product) {
      product.quantity += order.quantity;
      await product.save();
    }

    // Delete the order
    await order.deleteOne();

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
