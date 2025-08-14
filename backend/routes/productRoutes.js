const express = require('express');
const Product = require('../models/productModel');
const { protect, admin } = require('../middleware/authMiddleware');


const router = express.Router();

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            meterial,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimentions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            meterial,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimentions,
            weight,
            sku,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: createdProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

// @route PUT /api/products/:id
// @desc Update product
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            meterial,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimentions,
            weight,
            sku,
        } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.meterial = meterial || product.meterial;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured != undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished != undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimentions = dimentions || product.dimentions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // Save the updated product
            const updatedProduct = await product.save();
            res.json({
                success: true,
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
})

//@route DELETE /api/products/:id
//@desc Delete product
//@access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        await product.deleteOne();
        res.json({
            success: true,
            message: 'Product Deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

/// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public

router.get('/', async (req, res) => {
    try {
        const {
            collection, size, color, gender,
            minPrice, maxPrice, sortBy, search,
            category, material, brand, limit
        } = req.query;

        const query = {};

        if (collection && collection.toLowerCase() !== 'all') {
            query.collections = collection;
        }

        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(',') };
        }

        if (size) {
            query.sizes = { $in: size.split(',') };
        }

        if (color) {
            query.colors = { $in: color.split(',') };
        }

        if (gender) {
            query.gender = gender;
        }

        if (brand) {
            query.brand = { $in: brand.split(',') };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        switch (sortBy) {
            case 'priceAsc':
                sortOption = { price: 1 };
                break;
            case 'priceDesc':
                sortOption = { price: -1 };
                break;
            case 'popularity':
                sortOption = { rating: -1 };
                break;
        }

        const resultLimit = limit ? parseInt(limit) : 0;

        const products = await Product.find(query)
            .sort(sortOption)
            .limit(resultLimit);

        res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with the highest number of sales
router.get('/best-seller', async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.status(200).json({
                success: true,
                bestSeller,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No best seller found',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});


// @route Get /api/products/new-arrivals
// @desc Retrieve the latest products
// @access Public

router.get('/new-arrivals', async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.status(200).json({
            success: true,
            newArrivals,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});


// @route   GET /api/products/single/:id
// @desc Reterive similar products based on the current product's gender or category
// @access  Public
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category,
        }).limit(4);
        res.status(200).json({
            success: true,
            similarProducts,
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
})

// @route GET /api/products/:id
// @desc Retrieve a single product by ID
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

module.exports = router;
