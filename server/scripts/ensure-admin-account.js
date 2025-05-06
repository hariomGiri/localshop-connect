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

// Create or verify admin account
const ensureAdminAccount = async () => {
  try {
    // Check if admin already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    
    if (existingUser) {
      console.log('Admin account already exists with email: admin@example.com');
      console.log('User ID:', existingUser._id);
      console.log('Role:', existingUser.role);
      
      // Ensure the role is admin
      if (existingUser.role !== 'admin') {
        await User.findByIdAndUpdate(existingUser._id, { role: 'admin' });
        console.log('Updated user role to admin');
      }
      
      // Reset password to known value
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log('Reset admin password to: password123');
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Create new admin
      const newUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newUser.save();
      
      console.log('Admin account created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: password123');
      console.log('User ID:', newUser._id);
    }
    
    console.log('\nAdmin login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error ensuring admin account:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the function
ensureAdminAccount();
