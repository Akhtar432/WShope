
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRouter = require('./routes/subscriberRouter');
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const orderAdminRoutes = require('./routes/orderAdminRoutes');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
app.use(cors());




// Connect to the database
connectDB();

app.get('/my-orders', (req, res) => {
    res.send('welcome to the backend server!');
});

//API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/subscribe', subscriberRouter);

// Admin routes
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', orderAdminRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

