const express = require('express');
const User = require('../models/userModel');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route POST /api/admin/users
// @desc Add a new user (Admin only)
// @access Private/Admin

router.post('/', protect, admin, async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            role: isAdmin ? "admin" : "user",
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,  
                updatedAt: newUser.updatedAt
            }
        });
    } catch (error) {
        console.error(`Error creating user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

//@route PUT /api/admin/users/:id
//@desc Update a user (Admin only)
//@access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }
        user.role = isAdmin ? "admin" : "user";

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user (Admin only)
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});


module.exports = router;