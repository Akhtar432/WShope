const express = require('express');
const Product = require('../models/productModel');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

//route   GET /api/admin/products
// @desc    Get all products
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
