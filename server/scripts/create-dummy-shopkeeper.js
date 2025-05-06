import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
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

// Create dummy shopkeeper account
const createDummyShopkeeper = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'shopkeeper@example.com' });

    if (existingUser) {
      console.log('Dummy shopkeeper already exists with email: shopkeeper@example.com');
      console.log('User ID:', existingUser._id);

      // Check if shop exists for this user
      const existingShop = await Shop.findOne({ owner: existingUser._id });

      if (existingShop) {
        console.log('Shop already exists for this user');
        console.log('Shop ID:', existingShop._id);
        console.log('Shop Name:', existingShop.name);
        console.log('Shop Status:', existingShop.status);
      } else {
        // Create a shop for the existing user
        await createShopForUser(existingUser._id);
      }

      return;
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
      name: 'Demo Shopkeeper',
      email: 'shopkeeper@example.com',
      password: hashedPassword,
      role: 'shopkeeper'
    });

    const savedUser = await newUser.save();
    console.log('Created dummy shopkeeper with email: shopkeeper@example.com');
    console.log('Password: password123');
    console.log('User ID:', savedUser._id);

    // Create a shop for the new user
    await createShopForUser(savedUser._id);

  } catch (error) {
    console.error('Error creating dummy shopkeeper:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Create a shop for the user
const createShopForUser = async (userId) => {
  try {
    const newShop = new Shop({
      name: 'Demo Shop',
      description: 'This is a demo shop for testing purposes with a variety of local products.',
      owner: userId,
      category: 'grocery', // Using a valid category from the enum
      address: {
        street: '123 Main Street',
        city: 'Demo City',
        state: 'Demo State',
        zipCode: '12345',
        location: {
          type: 'Point',
          coordinates: [0, 0]
        }
      },
      contact: {
        email: 'shop@example.com',
        phone: '123-456-7890'
      },
      documents: {
        idProof: 'dummy-id.pdf',
        businessDocument: 'dummy-license.pdf'
      },
      status: 'approved' // Set to approved so you can access the dashboard immediately
    });

    const savedShop = await newShop.save();
    console.log('Created demo shop with name: Demo Shop');
    console.log('Shop ID:', savedShop._id);
    console.log('Shop Status:', savedShop.status);

  } catch (error) {
    console.error('Error creating shop:', error);
  }
};

// Run the function
createDummyShopkeeper();
