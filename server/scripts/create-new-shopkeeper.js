import mongoose from 'mongoose';
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

// Create a new shopkeeper account
const createNewShopkeeper = async () => {
  try {
    // Create a new user with a plain text password (will be hashed by the pre-save hook)
    const newUser = new User({
      name: 'Test Shopkeeper',
      email: 'test@example.com',
      password: 'password123',
      role: 'shopkeeper'
    });
    
    // Save the user
    const savedUser = await newUser.save();
    console.log('Created new shopkeeper:');
    console.log('ID:', savedUser._id);
    console.log('Name:', savedUser.name);
    console.log('Email:', savedUser.email);
    console.log('Role:', savedUser.role);
    console.log('Password: password123');
    
    // Create a shop for the user
    const newShop = new Shop({
      name: 'Test Shop',
      description: 'This is a test shop for testing purposes with a variety of local products.',
      owner: savedUser._id,
      category: 'grocery',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        location: {
          type: 'Point',
          coordinates: [0, 0]
        }
      },
      contact: {
        email: 'testshop@example.com',
        phone: '123-456-7890'
      },
      documents: {
        idProof: 'test-id.pdf',
        businessDocument: 'test-license.pdf'
      },
      status: 'approved'
    });
    
    // Save the shop
    const savedShop = await newShop.save();
    console.log('Created test shop:');
    console.log('ID:', savedShop._id);
    console.log('Name:', savedShop.name);
    console.log('Status:', savedShop.status);
    
  } catch (error) {
    console.error('Error creating new shopkeeper:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the function
createNewShopkeeper();
