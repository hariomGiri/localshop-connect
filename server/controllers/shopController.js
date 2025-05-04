import Shop from '../models/Shop.js';
import User from '../models/User.js';

// Register a new shop
export const registerShop = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      address,
      city,
      state,
      zipCode,
      email,
      phone,
      latitude,
      longitude
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !address || !city || !state || !zipCode || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Handle coordinates
    let coordinates = [0, 0]; // Default coordinates
    if (latitude && longitude) {
      coordinates = [parseFloat(longitude), parseFloat(latitude)];
    }

    // Create shop object
    const shopData = {
      name,
      description,
      category,
      address: {
        street: address,
        city,
        state,
        zipCode,
        location: {
          type: 'Point',
          coordinates: coordinates
        }
      },
      contact: {
        email,
        phone
      },
      owner: req.user.id,
      status: 'pending' // All shops start as pending
    };

    // Handle document uploads if they exist
    if (req.files) {
      const documents = {};

      if (req.files.idProof) {
        // Store the file path or reference
        documents.idProof = req.files.idProof[0].path;
      }

      if (req.files.businessDocument) {
        // Store the file path or reference
        documents.businessDocument = req.files.businessDocument[0].path;
      }

      // Add documents to shop data
      if (Object.keys(documents).length > 0) {
        shopData.documents = documents;
      }
    }

    // Create shop
    const shop = await Shop.create(shopData);

    // Update user with shopId and role
    await User.findByIdAndUpdate(req.user.id, {
      shopId: shop._id,
      role: 'shopkeeper'
    });

    res.status(201).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all shops
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ status: 'approved' });

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single shop
export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get shops by owner
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a shop yet'
      });
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update shop
export const updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Make sure user is shop owner
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Admin approve shop
export const approveShop = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Only admin can approve shops
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to approve shops'
      });
    }

    // Update shop with status and rejection reason if applicable
    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    shop = await Shop.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    // Get shop owner details for email notification
    const shopOwner = await User.findById(shop.owner);

    // Send email notification based on status
    if (shopOwner) {
      try {
        // Import email service
        const { sendShopApprovalEmail, sendShopRejectionEmail } = await import('../utils/emailService.js');

        let emailResult;
        if (status === 'approved') {
          emailResult = await sendShopApprovalEmail(shop, shopOwner);
        } else if (status === 'rejected') {
          emailResult = await sendShopRejectionEmail(shop, shopOwner, rejectionReason);
        }

        if (emailResult && !emailResult.success) {
          console.warn('Email notification sent but with issues:', emailResult.error);
        } else if (emailResult && emailResult.success) {
          console.log('Email notification sent successfully:', emailResult.messageId);

          // Add email notification status to the shop record
          await Shop.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                emailNotificationSent: true,
                emailNotificationDate: new Date()
              }
            },
            { new: false }
          );
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue with the response even if email fails
      }
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get nearby shops
export const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng, distance = 10000 } = req.query; // distance in meters, default 10km

    // Convert lat and lng to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid latitude and longitude'
      });
    }

    // Find shops near the coordinates
    const shops = await Shop.find({
      status: 'approved',
      'address.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance
        }
      }
    });

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};