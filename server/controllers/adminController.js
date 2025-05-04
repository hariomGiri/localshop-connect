import User from '../models/User.js';
import Shop from '../models/Shop.js';
import { sendTestEmail } from '../utils/emailService.js';

// Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    // Only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access admin statistics'
      });
    }

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get active shops count
    const activeShops = await Shop.countDocuments({ status: 'approved' });

    // Get pending shops count
    const pendingShops = await Shop.countDocuments({ status: 'pending' });

    // In a real application, you would have a Products model and Orders model
    // For now, we'll use placeholder values
    const totalProducts = 2874; // Placeholder
    const platformRevenue = 12628; // Placeholder

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeShops,
        pendingShops,
        totalProducts,
        platformRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all pending shops
export const getPendingShops = async (req, res) => {
  try {
    // Only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access pending shops'
      });
    }

    // Get all pending shops with owner information
    const pendingShops = await Shop.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingShops.length,
      data: pendingShops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get recent users
export const getRecentUsers = async (req, res) => {
  try {
    // Only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access user data'
      });
    }

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    res.status(200).json({
      success: true,
      count: recentUsers.length,
      data: recentUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Test email configuration
export const testEmailConfig = async (req, res) => {
  try {
    // Only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to test email configuration'
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Send test email
    const result = await sendTestEmail(email);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};