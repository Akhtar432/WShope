const express = require('express');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to get the cart for a user or guest
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
}

// @route POST /api/cart
// @desc Add product to the cart for a guest or logged-in use
// @access Private
router.post('/', protect, async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity, size, color, guestId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        //Determine if the user is a logged-in or guest
        let cart = await getCart(userId, guestId);

        //if the cart exists, update it.
        if (cart) {
            const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            );
            if (productIndex > -1) {
                cart.products[productIndex].quantity =
                    Number(cart.products[productIndex].quantity) + Number(quantity);
            }
            else {
                // Add new Product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || '',
                    price: product.price,
                    size,
                    color,
                    quantity
                })
            }
            // Recalculate the total prize
            cart.totalPrice = parseFloat(
                cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            ).toFixed(2);

            await cart.save();
            return res.status(200).json(cart);
        }
        else {
            //Create a new cart for the guest or user
            const newCart = await Cart.create({
                userId: userId ? userId : null,
                guestId: guestId ? null : (guestId || `guest_${Date.now()}`),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images?.[0]?.url || '',
                        price: product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice: product.price * quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' }
        );
    }
});

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged-in user
// @access Public

router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
            if (Number(quantity) === 0) {
                // Remove product if quantity is 0
                cart.products.splice(productIndex, 1);
            } else {
                // Update quantity
                cart.products[productIndex].quantity = Number(quantity);
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        // Recalculate total price
        cart.totalPrice = parseFloat(
            cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
        ).toFixed(2);

        await cart.save();

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @route DELETE /api/cart/
// @desc Remove a priduct from the cart
// @access Public

router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        const cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            // Recalculate total price
            cart.totalPrice = parseFloat(
                cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            ).toFixed(2);

            await cart.save();

            return res.status(200).json({
                success: true,
                cart
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }
    } catch (error) {
        console.error("Delete Cart Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// @route GET /api/cart
// @desc Get logged-in user or guest user's cart
// @access Public
router.get('/', async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.status(200).json({
                success: true,
                cart
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post('/merge', protect, async (req, res) => {
    const { guestId } = req.body;

    if (!guestId) {
        return res.status(400).json({ success: false, message: "guestId is required" });
    }

    try {
        const [guestCart, userCart] = await Promise.all([
            Cart.findOne({ guestId }),
            Cart.findOne({ user: req.user.id })
        ]);

        if (!guestCart) {
            return res.status(404).json({ success: false, message: "Guest cart not found" });
        }

        if (guestCart.products.length === 0) {
            return res.status(400).json({ success: false, message: "Guest cart is empty" });
        }

        if (!userCart) {
            // If user doesn't have a cart yet, convert guestCart to userCart
            guestCart.user = req.user.id;
            guestCart.guestId = undefined; 
            await guestCart.save();
            return res.status(200).json({
                success: true,
                message: "Guest cart assigned to user",
                cart: guestCart
            });
        }

        // Merge products
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

        // Recalculate total price
        userCart.totalPrice = userCart.products.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );

        await userCart.save();
        await Cart.findOneAndDelete({ guestId });

        return res.status(200).json({
            success: true,
            message: "Guest cart merged into user cart",
            cart: userCart
        });

    } catch (error) {
        console.error("Merge cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router