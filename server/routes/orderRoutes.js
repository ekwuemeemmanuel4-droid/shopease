import express from 'express';
import Order from '../models/Order.js';
import protect from '../middleware/authMiddleware.js';
import Stripe from 'stripe';
import adminOnly from '../middleware/adminMiddleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// @route   POST /api/orders/create-payment-intent
// @desc    Create a Stripe payment intent for an order
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/orders
// @desc    Admin: get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user.id || req.user._id,
      items,
      totalAmount,
      shippingAddress,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;