import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^254\d{9}$|^\d{10}$/, 'Phone must be valid format (254xxxxxxxxx or 0xxxxxxxxx)'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Service Schema
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a service name'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a service description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [1, 'Price must be at least 1'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    duration: {
      type: String,
      default: '2-3 hours',
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    userDetails: {
      name: String,
      email: String,
      phone: String,
    },
    serviceDetails: {
      name: String,
      price: Number,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa'],
      default: 'mpesa',
    },
    mpesaDetails: {
      merchantRequestId: String,
      checkoutRequestId: String,
      resultCode: String,
      resultDesc: String,
      responseCode: String,
      responseDesc: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid',
    },
    notes: String,
    completedAt: Date,
  },
  { timestamps: true }
);

// Create indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);
export const Service = mongoose.model('Service', serviceSchema);
export const Order = mongoose.model('Order', orderSchema);
