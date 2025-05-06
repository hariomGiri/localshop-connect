import mongoose from 'mongoose';
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

// Create a test user directly
const createDirectUser = async () => {
  try {
    // Create a user schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isEmailVerified: Boolean,
      createdAt: Date,
      updatedAt: Date
    });
    
    // Create a user model
    const User = mongoose.model('User', userSchema);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists with email: test@example.com');
      
      // Update the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123', salt);
      
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log('Password updated for existing user');
      console.log('Email: test@example.com');
      console.log('Password: test123');
      
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    // Create new user
    const newUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'customer',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newUser.save();
    
    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

// Run the function
createDirectUser();
