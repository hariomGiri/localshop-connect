import mongoose from 'mongoose';
import User from '../models/User.js';
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

// Update admin user properly
const updateAdmin = async () => {
  try {
    // Find admin user
    const user = await User.findOne({ email: 'admin@example.com' });
    
    if (!user) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found:');
    console.log('ID:', user._id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    
    // Update password using save method to trigger the pre-save middleware
    user.password = 'password123';
    await user.save();
    
    console.log('Admin password updated successfully!');
    
    // Verify the user was updated correctly
    const updatedUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    console.log('Updated password hash:', updatedUser.password);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin user:', error);
    process.exit(1);
  }
};

// Run the function
updateAdmin();
