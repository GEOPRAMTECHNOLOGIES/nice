import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes Import
import * as authController from './routes/auth.js';
import * as servicesController from './routes/services.js';
import * as ordersController from './routes/orders.js';
import { protect, authorize } from './middleware/auth.js';

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register-admin', authController.registerAdmin);
app.get('/api/auth/me', protect, authController.getMe);

// Services Routes
app.post('/api/services', protect, authorize('admin'), servicesController.createService);
app.get('/api/services', servicesController.getServices);
app.get('/api/services/:id', servicesController.getService);
app.put('/api/services/:id', protect, authorize('admin'), servicesController.updateService);
app.delete('/api/services/:id', protect, authorize('admin'), servicesController.deleteService);

// Orders Routes
app.post('/api/orders', protect, ordersController.createOrder);
app.post('/api/orders/:orderId/payment', protect, ordersController.initiatePayment);
app.get('/api/orders', protect, ordersController.getUserOrders);
app.get('/api/orders/:orderId', protect, ordersController.getOrder);

// M-Pesa Callback (Public)
app.post('/api/payments/callback', ordersController.handleMpesaCallback);

// Admin Routes
app.get('/api/admin/orders', protect, authorize('admin'), ordersController.getAllOrders);
app.put('/api/admin/orders/:id', protect, authorize('admin'), ordersController.updateOrderStatus);
app.get('/api/admin/stats', protect, authorize('admin'), ordersController.getDashboardStats);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
