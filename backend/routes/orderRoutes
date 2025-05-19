const express = require('express');
const Order = require('../models/orderModel');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/orders
// @desc    Get all orders for logged-in user
// @access  Private
router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(`Error fetching orders: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate("user", "name email");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error(`Error fetching order: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}); 

module.exports = router;