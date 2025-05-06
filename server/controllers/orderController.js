import Order from '../models/Order.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shops,
      subtotal,
      tax,
      deliveryFee,
      total,
      orderType,
      expectedDeliveryDate,
      paymentMethod,
      deliveryAddress,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !items.length || !shops || !shops.length || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    // Create order object
    const orderData = {
      customer: req.user.id,
      items,
      shops,
      subtotal,
      tax,
      deliveryFee,
      total,
      orderType: orderType || 'regular',
      paymentMethod: paymentMethod || 'cash_on_delivery',
      deliveryAddress,
      notes
    };

    // Add expected delivery date for pre-orders
    if (orderType === 'pre-order' && expectedDeliveryDate) {
      orderData.expectedDeliveryDate = expectedDeliveryDate;
    }

    // Create order
    const order = await Order.create(orderData);

    // Return success response
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders for the current user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single order by ID
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the user is authorized to view this order
    if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get orders for a specific shop (shopkeeper only)
export const getShopOrders = async (req, res) => {
  try {
    // Get the shop owned by the current user
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Find orders that contain items from this shop
    const orders = await Order.find({
      'shops.shopId': shop._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (shopkeeper or admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If user is a shopkeeper, verify they own one of the shops in the order
    if (req.user.role === 'shopkeeper') {
      const shop = await Shop.findOne({ owner: req.user.id });
      
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      const isShopInOrder = order.shops.some(
        orderShop => orderShop.shopId.toString() === shop._id.toString()
      );

      if (!isShopInOrder) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this order'
        });
      }
    }

    // Update order status
    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel an order (customer, shopkeeper, or admin)
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the user is authorized to cancel this order
    if (req.user.role !== 'admin') {
      if (req.user.role === 'customer' && order.customer.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to cancel this order'
        });
      }

      if (req.user.role === 'shopkeeper') {
        const shop = await Shop.findOne({ owner: req.user.id });
        
        if (!shop) {
          return res.status(404).json({
            success: false,
            message: 'Shop not found'
          });
        }

        const isShopInOrder = order.shops.some(
          orderShop => orderShop.shopId.toString() === shop._id.toString()
        );

        if (!isShopInOrder) {
          return res.status(401).json({
            success: false,
            message: 'Not authorized to cancel this order'
          });
        }
      }
    }

    // Check if order can be cancelled (only pending or processing orders)
    if (!['pending', 'processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`
      });
    }

    // Update order status to cancelled
    order.orderStatus = 'cancelled';
    order.notes = order.notes ? `${order.notes}\n\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
