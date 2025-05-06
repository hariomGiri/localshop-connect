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

// Fix admin login
const fixAdminLogin = async () => {
  try {
    // Define the User schema directly to avoid any middleware issues
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isEmailVerified: Boolean,
      createdAt: Date,
      updatedAt: Date
    });
    
    // Create a model directly from the schema
    const User = mongoose.model('User', userSchema, 'users');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('Admin user not found. Creating new admin user...');
      
      // Create new admin user with direct password hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newAdmin.save();
      console.log('New admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: password123');
      console.log('Password hash:', hashedPassword);
    } else {
      console.log('Admin user found. Updating password directly...');
      
      // Generate a new password hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Update the password directly in the database
      await User.updateOne(
        { email: 'admin@example.com' },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Admin password updated successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: password123');
      console.log('New password hash:', hashedPassword);
    }
    
    // Verify the password hash works
    const updatedAdmin = await User.findOne({ email: 'admin@example.com' });
    console.log('\nVerifying password hash:');
    const isMatch = await bcrypt.compare('password123', updatedAdmin.password);
    console.log('Password match result:', isMatch ? 'SUCCESS' : 'FAILED');
    
    if (!isMatch) {
      console.error('WARNING: Password verification failed. Login may not work.');
    } else {
      console.log('Password verification successful. Login should work now.');
    }
    
  } catch (error) {
    console.error('Error fixing admin login:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the function
fixAdminLogin();
