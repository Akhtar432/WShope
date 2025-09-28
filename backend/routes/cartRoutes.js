const express = require('express');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Helper function to get the cart for a user or guest
const getCart = async (userId, guestId) => {
    if (userId) return await Cart.findOne({ user: userId });
    if (guestId) return await Cart.findOne({ guestId });
    return null;
};

// @route POST /api/cart
// @desc Add product to cart (guest or logged-in user)
// @access Public
router.post('/', async (req, res) => {
    let userId;
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        }
    } catch (err) {
        userId = null; // guest
    }

    const { productId, quantity, size, color, guestId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(p =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += Number(quantity);
            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || '',
                    price: product.price,
                    size,
                    color,
                    quantity
                });
            }

            cart.totalPrice = parseFloat(cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            const newCart = await Cart.create({
                user: userId || null,
                guestId: !userId ? (guestId || `guest_${Date.now()}`) : null,
                products: [{
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || '',
                    price: product.price,
                    size,
                    color,
                    quantity
                }],
                totalPrice: product.price * quantity
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route PUT /api/cart
// @desc Update product quantity in cart
// @access Public
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const productIndex = cart.products.findIndex(p =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
            if (Number(quantity) === 0) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity = Number(quantity);
            }
        } else return res.status(404).json({ success: false, message: "Product not found in cart" });

        cart.totalPrice = parseFloat(cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2);
        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// @route DELETE /api/cart
// @desc Remove product from cart
// @access Public
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const productIndex = cart.products.findIndex(p =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = parseFloat(cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2);
            await cart.save();
            return res.status(200).json(cart);
        } else return res.status(404).json({ success: false, message: "Product not found in cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// @route GET /api/cart
// @desc Get cart by user or guest
// @access Public
router.get('/', async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) return res.status(200).json({ success: true, cart });
        return res.status(404).json({ success: false, message: "Cart not found" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post('/merge', protect, async (req, res) => {
    const { guestId } = req.body;
    if (!guestId) return res.status(400).json({ success: false, message: "guestId is required" });

    try {
        const [guestCart, userCart] = await Promise.all([
            Cart.findOne({ guestId }),
            Cart.findOne({ user: req.user.id })
        ]);

        if (!guestCart) return res.status(404).json({ success: false, message: "Guest cart not found" });
        if (guestCart.products.length === 0) return res.status(400).json({ success: false, message: "Guest cart is empty" });

        if (!userCart) {
            guestCart.user = req.user.id;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json({ success: true, cart: guestCart });
        }

        guestCart.products.forEach(guestProduct => {
            const existingIndex = userCart.products.findIndex(userProduct =>
                userProduct.productId.toString() === guestProduct.productId.toString() &&
                userProduct.size === guestProduct.size &&
                userProduct.color === guestProduct.color
            );

            if (existingIndex > -1) {
                userCart.products[existingIndex].quantity += guestProduct.quantity;
            } else {
                userCart.products.push(guestProduct);
            }
        });

        userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await userCart.save();
        await Cart.findOneAndDelete({ guestId });

        return res.status(200).json({ success: true, cart: userCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
