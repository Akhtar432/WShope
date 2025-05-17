const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {protect} = require('../middleware/authMiddleware');
const router = require('express').Router();

//route POST /api/user/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        // Create user
        user = new User({ name, email, password });
        await user.save();

        // Generate JWT
        const payload = { id: user._id, role: user.role };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30h' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error generating token',
                    });
                }
                // Return token + minimal user data
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token
                });
            }
        );
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
    
//route POST /api/user/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email }).select('+password'); 
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password', 
            });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate and return JWT
        const payload = { id: user._id, role: user.role };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30h' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error generating token',
                    });
                }
                res.status(200).json({
                    success: true,
                    message: 'User logged in successfully',
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
        );
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
//route GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
});

//route PUT /api/user/update    
router.put('/update', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByIdAndUpdate(decoded.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
//route DELETE /api/user/delete
router.delete('/delete', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByIdAndDelete(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
module.exports = router;    
