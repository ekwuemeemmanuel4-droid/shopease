import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import  protect  from '../middleware/authMiddleware.js';
import  adminOnly  from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reports/sales', protect, adminOnly, async (req, res) => {
  try {
    const salesByDay = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(salesByDay);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reports/top-products', protect, adminOnly, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reports/low-stock', protect, adminOnly, async (req, res) => {
  try {
    const lowStock = await Product.find({ stock: { $lte: 5 } }).select('name stock');
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;