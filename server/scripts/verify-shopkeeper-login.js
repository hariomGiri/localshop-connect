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

// Verify and fix shopkeeper logins
const verifyShopkeeperLogins = async () => {
  try {
    // Define the User schema directly to avoid any middleware issues
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      shopId: mongoose.Schema.Types.ObjectId,
      isEmailVerified: Boolean,
      createdAt: Date,
      updatedAt: Date
    });
    
    // Create a model directly from the schema
    const User = mongoose.model('User', userSchema, 'users');
    
    // Shopkeeper emails to verify
    const shopkeeperEmails = [
      'raj@grocery.com',
      'priya@fashion.com',
      'sharma@electronics.com',
      'patel@bakery.com'
    ];
    
    for (const email of shopkeeperEmails) {
      // Find shopkeeper user
      const shopkeeper = await User.findOne({ email });
      
      if (!shopkeeper) {
        console.log(`Shopkeeper with email ${email} not found.`);
        continue;
      }
      
      console.log(`\nVerifying shopkeeper: ${shopkeeper.name} (${email})`);
      
      // Verify the password hash works
      const isMatch = await bcrypt.compare('password123', shopkeeper.password);
      console.log('Password match result:', isMatch ? 'SUCCESS' : 'FAILED');
      
      if (!isMatch) {
        console.log('Fixing password for this shopkeeper...');
        
        // Generate a new password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        // Update the password directly in the database
        await User.updateOne(
          { email },
          { 
            $set: { 
              password: hashedPassword,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log('Password updated successfully!');
        console.log('New password hash:', hashedPassword);
        
        // Verify the new password hash works
        const updatedShopkeeper = await User.findOne({ email });
        const newIsMatch = await bcrypt.compare('password123', updatedShopkeeper.password);
        console.log('New password match result:', newIsMatch ? 'SUCCESS' : 'FAILED');
      } else {
        console.log('Password is already correct for this shopkeeper.');
      }
    }
    
    console.log('\nAll shopkeeper accounts verified and fixed if needed.');
    console.log('Login credentials for all shopkeepers:');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error verifying shopkeeper logins:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the function
verifyShopkeeperLogins();
