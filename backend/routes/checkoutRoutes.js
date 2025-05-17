const express = require("express");
const Checkout = require("../models/checkoutModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const {protect} = require('../middleware/authMiddleware');
const router = require('express').Router();

// @route POST /api/checkout
// @desc Create a new cheackout session
// @access Privet
