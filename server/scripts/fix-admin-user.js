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

// Fix admin user
const fixAdminUser = async () => {
  try {
    // Find admin user
    let user = await User.findOne({ email: 'admin@example.com' });
    
    if (!user) {
      console.log('Admin user not found. Creating new admin user...');
      
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      user = new User({
        name: 'Test Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await user.save();
      console.log('New admin user created successfully!');
    } else {
      console.log('Admin user found. Updating password...');
      
      // Update admin password directly using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Update using findOneAndUpdate to bypass any middleware
      await User.findOneAndUpdate(
        { email: 'admin@example.com' },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Admin password updated successfully!');
    }
    
    // Verify the user was created/updated correctly
    const updatedUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    console.log('Admin user details:');
    console.log('ID:', updatedUser._id);
    console.log('Name:', updatedUser.name);
    console.log('Email:', updatedUser.email);
    console.log('Role:', updatedUser.role);
    console.log('Password hash:', updatedUser.password);
    
    // Test the login manually
    console.log('\nTesting login with admin@example.com / password123:');
    const isMatch = await bcrypt.compare('password123', updatedUser.password);
    console.log('Password match result:', isMatch ? 'SUCCESS' : 'FAILED');
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin user:', error);
    process.exit(1);
  }
};

// Run the function
fixAdminUser();
