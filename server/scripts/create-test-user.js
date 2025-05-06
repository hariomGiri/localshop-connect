import mongoose from 'mongoose';
import User from '../models/User.js';
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

// Create a test user
const createTestUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'customer@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists with email: customer@example.com');
      console.log('User ID:', existingUser._id);
      console.log('Role:', existingUser.role);
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create new user
    const newUser = new User({
      name: 'Test Customer',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'customer',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newUser.save();
    
    console.log('Test user created successfully!');
    console.log('Email: customer@example.com');
    console.log('Password: password123');
    console.log('User ID:', newUser._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

// Run the function
createTestUser();
