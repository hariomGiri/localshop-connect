import mongoose from 'mongoose';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localshop-connect')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create a test shopkeeper with an approved shop
const createTestShopkeeper = async () => {
  try {
    // Check if shopkeeper already exists
    const existingUser = await User.findOne({ email: 'shopkeeper@example.com' });
    
    if (existingUser) {
      console.log('Test shopkeeper already exists with email: shopkeeper@example.com');
      
      // Check if shop exists
      const shop = await Shop.findOne({ owner: existingUser._id });
      
      if (shop) {
        console.log('Shop already exists for this shopkeeper');
        console.log('Shop ID:', shop._id);
        console.log('Shop Name:', shop.name);
        console.log('Shop Status:', shop.status);
      } else {
        console.log('No shop found for this shopkeeper. Creating a shop...');
        await createShop(existingUser._id);
      }
      
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create new shopkeeper
    const newUser = new User({
      name: 'Test Shopkeeper',
      email: 'shopkeeper@example.com',
      password: hashedPassword,
      role: 'shopkeeper',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newUser.save();
    
    console.log('Test shopkeeper created successfully!');
    console.log('Email: shopkeeper@example.com');
    console.log('Password: password123');
    console.log('User ID:', newUser._id);
    
    // Create a shop for the shopkeeper
    await createShop(newUser._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test shopkeeper:', error);
    process.exit(1);
  }
};

// Create a shop for the shopkeeper
const createShop = async (ownerId) => {
  try {
    const shop = new Shop({
      name: 'Test Shop',
      description: 'This is a test shop created for demonstration purposes.',
      category: 'grocery',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749] // San Francisco coordinates
        }
      },
      contact: {
        email: 'shop@example.com',
        phone: '555-123-4567'
      },
      owner: ownerId,
      status: 'approved', // Set to approved so you can see the full dashboard
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await shop.save();
    
    // Update user with shopId
    await User.findByIdAndUpdate(ownerId, {
      shopId: shop._id
    });
    
    console.log('Shop created successfully for the shopkeeper!');
    console.log('Shop ID:', shop._id);
    console.log('Shop Name:', shop.name);
    console.log('Shop Status:', shop.status);
  } catch (error) {
    console.error('Error creating shop:', error);
  }
};

// Run the function
createTestShopkeeper();
