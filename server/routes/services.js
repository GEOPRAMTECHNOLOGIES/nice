import express from 'express';
import { Service } from '../models/index.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/services
// @desc    Create a new service (admin only)
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { name, description, price, category, duration, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const service = await Service.create({
      name,
      description,
      price,
      category,
      duration: duration || '2-3 hours',
      image: image || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .select('-createdBy')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/services/:id
// @desc    Update service (admin only)
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const { name, description, price, category, duration, image, isActive } = req.body;

    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check if user is the one who created the service or is admin
    if (service.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service',
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name: name || service.name,
        description: description || service.description,
        price: price || service.price,
        category: category || service.category,
        duration: duration || service.duration,
        image: image !== undefined ? image : service.image,
        isActive: isActive !== undefined ? isActive : service.isActive,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/services/:id
// @desc    Delete service (admin only)
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default router;
