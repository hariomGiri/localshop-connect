import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the .env file in the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localshop-connect')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Update customer password
const updateCustomerPassword = async () => {
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
    
    // Find the customer user
    const user = await User.findOne({ email: 'customer@example.com' });
    
    if (!user) {
      console.log('Customer user not found');
      process.exit(1);
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Update the password
    user.password = hashedPassword;
    await user.save();
    
    console.log('Password updated successfully for customer@example.com');
    console.log('New password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
};

// Run the function
updateCustomerPassword();
