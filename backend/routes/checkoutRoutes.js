const express = require("express");
const Checkout = require("../models/checkoutModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const { protect } = require('../middleware/authMiddleware');
const router = require('express').Router();

// @route POST /api/checkout
// @desc Create a new cheackout session
// @access Privet

router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No items in checkout",
        });
    }

    try {
        // Create a new checkout session
        const checkoutSession = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json({
            success: true,
            message: "Checkout session created successfully",
            checkoutSession,
        });
    } catch (error) {
        console.error(`Error creating checkout session: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

});

// @route   PUT /api/checkout/:id/pay
// @desc    Update the checkout to mark as paid after successful payment
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    const { id } = req.params;

    try {
        // Find the checkout session
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found",
            });
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();

            await checkout.save();

            res.status(200).json({
                success: true,
                message: "Payment successful",
                checkout,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid Payment Status",
            });
        }
    } catch (error) {
        console.error(`Error processing payment: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// @route   POST /api/checkout/:id/finalize
// @desc    Finalize checkout and convert to an order after payment confirmation
// @access  Private
router.post("/:id/finalize", protect, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the checkout session
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found",
            });
        }

        // Check if already finalized
        if (checkout.isFinalized) {
            return res.status(400).json({
                success: false,
                message: "Checkout session already finalized",
            });
        }

        // Verify payment was completed
        if (!checkout.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Checkout not paid",
            });
        }

        // Create an order
        const finalOrder = await Order.create({
            user: checkout.user,
             orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt || Date.now(),
            paymentStatus: checkout.paymentStatus,
            paymentDetails: checkout.paymentDetails,
        });

        // Finalize checkout session
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();
        await Cart.deleteMany({ user: checkout.user });

        return res.status(201).json({
            success: true,
            message: "Checkout finalized and order created successfully",
            finalOrder,
        });

    } catch (error) {
        console.error(`Error finalizing checkout: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}); 

module.exports = router;