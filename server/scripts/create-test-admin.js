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

// Create a test admin
const createTestAdmin = async () => {
  try {
    // Check if admin already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    
    if (existingUser) {
      console.log('Test admin already exists with email: admin@example.com');
      console.log('User ID:', existingUser._id);
      console.log('Role:', existingUser.role);
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create new admin
    const newUser = new User({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newUser.save();
    
    console.log('Test admin created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('User ID:', newUser._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test admin:', error);
    process.exit(1);
  }
};

// Run the function
createTestAdmin();
