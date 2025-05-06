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

// Verify admin user
const verifyAdmin = async () => {
  try {
    // Find admin user
    const user = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!user) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found:');
    console.log('ID:', user._id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    
    // Test password
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log(`Password '${testPassword}' is ${isMatch ? 'correct' : 'incorrect'}`);
    
    if (!isMatch) {
      // Create a new password hash for testing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      console.log('New password hash for testing:', hashedPassword);
      
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
      console.log('Password updated to:', testPassword);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error verifying admin user:', error);
    process.exit(1);
  }
};

// Run the function
verifyAdmin();
