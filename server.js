const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const express = require('express');
const app = express();

// Routes
const healthRoutes = require('./routes/healthRoutes');
const productsRoutes = require('./routes/productsRoutes');
const couponRoutes = require('./routes/couponRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Middleware
const authController = require('./controllers/authController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use(healthRoutes);
app.use(authRoutes);
app.use(authController.authMiddleware); // Middleware
app.use(productsRoutes);
app.use('/cart',cartRoutes);
app.use(couponRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});