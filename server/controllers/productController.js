import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Check if user has a shop
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'You must have a shop to create products'
      });
    }

    // Check if shop is approved
    if (shop.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your shop must be approved to create products'
      });
    }

    // Create product data
    const productData = {
      ...req.body,
      shop: shop._id
    };

    // Handle image upload if present
    if (req.file) {
      productData.imageUrl = req.file.path;
    }

    // Create product
    const product = await Product.create(productData);

    // Update shop's product count
    const productCount = await Product.countDocuments({ shop: shop._id });
    shop.productCount = productCount;
    await shop.save();

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shop', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by shop
export const getShopProducts = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.params.shopId });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get my shop's products
export const getMyProducts = async (req, res) => {
  try {
    // Find user's shop
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a shop'
      });
    }

    // Find products for this shop
    const products = await Product.find({ shop: shop._id });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find user's shop
    const shop = await Shop.findOne({ owner: req.user.id });

    // Check if user owns this product
    if (product.shop.toString() !== shop._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product'
      });
    }

    // Create update data
    const updateData = { ...req.body };

    // Ensure shop field is not overwritten with invalid data
    delete updateData.shop;

    // Handle image upload if present
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    // Update shop's product count (not strictly necessary for updates, but ensures consistency)
    const productCount = await Product.countDocuments({ shop: shop._id });
    shop.productCount = productCount;
    await shop.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find user's shop
    const shop = await Shop.findOne({ owner: req.user.id });

    // Check if user owns this product
    if (product.shop.toString() !== shop._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product'
      });
    }

    await product.deleteOne();

    // Update shop's product count after deletion
    const productCount = await Product.countDocuments({ shop: shop._id });
    shop.productCount = productCount;
    await shop.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
