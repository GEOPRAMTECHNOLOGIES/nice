import express from 'express';
import { v4 as uuidv4 } from 'crypto';
import { Order, Service, User } from '../models/index.js';
import { protect, authorize } from '../middleware/auth.js';
import { initiateSTKPush } from '../services/mpesa.js';

const router = express.Router();

// Generate unique order ID
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { serviceId, phone } = req.body;

    if (!serviceId || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceId and phone',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    const user = req.user;

    // Create order
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      user: user._id,
      service: serviceId,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: phone || user.phone,
      },
      serviceDetails: {
        name: service.name,
        price: service.price,
      },
      amount: service.price,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.orderId,
        id: order._id,
        amount: order.amount,
        serviceDetails: order.serviceDetails,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/orders/:orderId/payment
// @desc    Initiate M-Pesa payment for order
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { phone } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order',
      });
    }

    const mpesaConfig = {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      shortCode: process.env.MPESA_SHORTCODE,
      passKey: process.env.MPESA_PASSKEY,
    };

    const callbackUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/callback`;

    const result = await initiateSTKPush(
      phone || order.userDetails.phone,
      order.amount,
      orderId,
      `Payment for ${order.serviceDetails.name}`,
      mpesaConfig,
      callbackUrl
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    // Update order with M-Pesa details
    order.mpesaDetails = {
      merchantRequestId: result.data.merchantRequestId,
      checkoutRequestId: result.data.checkoutRequestId,
      responseCode: result.data.responseCode,
      responseDesc: result.data.responseDesc,
    };
    await order.save();

    res.status(200).json({
      success: true,
      message: 'STK push initiated',
      data: {
        merchantRequestId: result.data.merchantRequestId,
        checkoutRequestId: result.data.checkoutRequestId,
        customerMessage: result.data.customerMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/payments/callback
// @desc    M-Pesa payment callback
// @access  Public
export const handleMpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    // Find order by checkoutRequestId
    const order = await Order.findOne({
      'mpesaDetails.checkoutRequestId': checkoutRequestId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order based on result code
    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = callbackData.CallbackMetadata.Item;
      const mpesaReceiptNumber = callbackMetadata.find(
        (item) => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      order.status = 'completed';
      order.paymentStatus = 'paid';
      order.completedAt = new Date();
      order.mpesaDetails.resultCode = resultCode;
      order.mpesaDetails.resultDesc = 'Payment successful';
      order.mpesaDetails.responseCode = 'A08AABD30C660D61D6813526A0979EE1'; // Example receipt
      order.mpesaDetails.responseDesc = mpesaReceiptNumber;
    } else {
      // Payment failed
      order.status = 'failed';
      order.paymentStatus = 'failed';
      order.mpesaDetails.resultCode = resultCode;
      order.mpesaDetails.resultDesc = callbackData.ResultDesc || 'Payment failed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Callback processed',
    });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('service', 'name price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/orders/:orderId
// @desc    Get single order
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user._id,
    }).populate('service');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Routes
// @route   GET /api/admin/orders
// @desc    Get all orders (admin only)
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name price category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/admin/orders/:id
// @desc    Update order status (admin only)
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes: notes || order.notes,
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics (admin only)
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const failedOrders = await Order.countDocuments({ paymentStatus: 'failed' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .populate('service', 'name price')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        completedOrders,
        paidOrders,
        failedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default router;
