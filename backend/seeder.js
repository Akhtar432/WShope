const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const products = require('./data/products');
const Cart = require('./models/cartModel')

dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

//Fuction to seed the database
const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        const createdUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin',
        });

        // Assign the default user ID to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: userID };
        });

        //Insert the products into the database
        await Product.insertMany(sampleProducts);
        console.log('Product data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}
// Call the seedData function
seedData();