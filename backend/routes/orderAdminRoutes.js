const express = require('express');
const Order = require('../models/orderModel');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @routes GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(`Error fetching orders: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json({
            success: true,
            order: {
                id: updatedOrder._id,
                status: updatedOrder.status,
                updatedAt: updatedOrder.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        customer: order.user.name,
        date: order.createdAt,
        amount: order.totalPrice,
        status: order.status,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

module.exports = router;
