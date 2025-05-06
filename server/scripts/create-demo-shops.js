import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
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

// Demo shop data
const demoShops = [
  {
    user: {
      name: 'Raj Grocery Store',
      email: 'raj@grocery.com',
      password: 'password123',
      role: 'shopkeeper'
    },
    shop: {
      name: 'Raj Grocery Store',
      description: 'A local grocery store offering fresh vegetables, fruits, and daily essentials at affordable prices.',
      category: 'grocery',
      address: {
        street: '123 Market Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760] // Mumbai coordinates
        }
      },
      contact: {
        email: 'contact@rajgrocery.com',
        phone: '9876543210'
      },
      documents: {
        idProof: 'demo-id-1.pdf',
        businessDocument: 'demo-license-1.pdf'
      }
    },
    products: [
      {
        name: 'Fresh Tomatoes',
        description: 'Locally sourced fresh tomatoes, perfect for curries and salads.',
        price: 40,
        category: 'vegetables',
        stock: 100,
        imageUrl: '/images/products/tomatoes.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Basmati Rice (5kg)',
        description: 'Premium quality basmati rice, aromatic and perfect for biryanis.',
        price: 350,
        category: 'grains',
        stock: 50,
        imageUrl: '/images/products/rice.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Organic Bananas',
        description: 'Organically grown bananas, rich in potassium and other nutrients.',
        price: 60,
        category: 'fruits',
        stock: 75,
        imageUrl: '/images/products/bananas.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      }
    ]
  },
  {
    user: {
      name: 'Priya Fashion',
      email: 'priya@fashion.com',
      password: 'password123',
      role: 'shopkeeper'
    },
    shop: {
      name: 'Priya Fashion Boutique',
      description: 'A trendy fashion boutique offering the latest styles in ethnic and western wear for women.',
      category: 'fashion',
      address: {
        street: '45 Fashion Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // Delhi coordinates
        }
      },
      contact: {
        email: 'contact@priyafashion.com',
        phone: '9876543211'
      },
      documents: {
        idProof: 'demo-id-2.pdf',
        businessDocument: 'demo-license-2.pdf'
      }
    },
    products: [
      {
        name: 'Designer Saree',
        description: 'Handcrafted designer saree with intricate embroidery work.',
        price: 3500,
        category: 'ethnic wear',
        stock: 20,
        imageUrl: '/images/products/saree.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Cotton Kurti',
        description: 'Comfortable cotton kurti with traditional block prints.',
        price: 850,
        category: 'ethnic wear',
        stock: 35,
        imageUrl: '/images/products/kurti.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Leather Handbag',
        description: 'Stylish genuine leather handbag with multiple compartments.',
        price: 1200,
        category: 'accessories',
        stock: 15,
        imageUrl: '/images/products/handbag.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      }
    ]
  },
  {
    user: {
      name: 'Sharma Electronics',
      email: 'sharma@electronics.com',
      password: 'password123',
      role: 'shopkeeper'
    },
    shop: {
      name: 'Sharma Electronics',
      description: 'Your one-stop shop for all electronic gadgets, appliances, and accessories.',
      category: 'electronics',
      address: {
        street: '78 Tech Plaza',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716] // Bangalore coordinates
        }
      },
      contact: {
        email: 'contact@sharmaelectronics.com',
        phone: '9876543212'
      },
      documents: {
        idProof: 'demo-id-3.pdf',
        businessDocument: 'demo-license-3.pdf'
      }
    },
    products: [
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 10 hours battery life and deep bass.',
        price: 1500,
        category: 'audio',
        stock: 30,
        imageUrl: '/images/products/speaker.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'USB Power Bank',
        description: '10000mAh power bank with fast charging support for all devices.',
        price: 999,
        category: 'accessories',
        stock: 45,
        imageUrl: '/images/products/powerbank.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Wireless Earbuds',
        description: 'True wireless earbuds with noise cancellation and touch controls.',
        price: 2500,
        category: 'audio',
        stock: 25,
        imageUrl: '/images/products/earbuds.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      }
    ]
  },
  {
    user: {
      name: 'Patel Bakery',
      email: 'patel@bakery.com',
      password: 'password123',
      role: 'shopkeeper'
    },
    shop: {
      name: 'Patel Bakery & Confectionery',
      description: 'Freshly baked breads, cakes, pastries and other confectionery items made with premium ingredients.',
      category: 'bakery',
      address: {
        street: '22 Baker Street',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001',
        location: {
          type: 'Point',
          coordinates: [72.5714, 23.0225] // Ahmedabad coordinates
        }
      },
      contact: {
        email: 'contact@patelbakery.com',
        phone: '9876543213'
      },
      documents: {
        idProof: 'demo-id-4.pdf',
        businessDocument: 'demo-license-4.pdf'
      }
    },
    products: [
      {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with ganache frosting, perfect for celebrations.',
        price: 450,
        category: 'cakes',
        stock: 10,
        imageUrl: '/images/products/chocolate-cake.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Multigrain Bread',
        description: 'Healthy multigrain bread made with organic flour and seeds.',
        price: 60,
        category: 'breads',
        stock: 30,
        imageUrl: '/images/products/bread.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      },
      {
        name: 'Assorted Cookies (250g)',
        description: 'Assortment of butter, chocolate chip, and almond cookies.',
        price: 180,
        category: 'cookies',
        stock: 40,
        imageUrl: '/images/products/cookies.jpg',
        isAvailableForDelivery: true,
        isAvailableForPickup: true
      }
    ]
  }
];

// Create demo shops and products
const createDemoShopsAndProducts = async () => {
  try {
    console.log('Creating demo shops and products...');
    
    for (const demoData of demoShops) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: demoData.user.email });
      
      let userId;
      
      if (existingUser) {
        console.log(`User with email ${demoData.user.email} already exists.`);
        userId = existingUser._id;
      } else {
        // Create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoData.user.password, salt);
        
        const newUser = new User({
          name: demoData.user.name,
          email: demoData.user.email,
          password: hashedPassword,
          role: demoData.user.role,
          isEmailVerified: true
        });
        
        const savedUser = await newUser.save();
        userId = savedUser._id;
        
        console.log(`Created user: ${demoData.user.name} (${demoData.user.email})`);
      }
      
      // Check if shop already exists for this user
      let existingShop = await Shop.findOne({ owner: userId });
      let shopId;
      
      if (existingShop) {
        console.log(`Shop already exists for user ${demoData.user.email}`);
        shopId = existingShop._id;
      } else {
        // Create shop
        const newShop = new Shop({
          ...demoData.shop,
          owner: userId,
          status: 'approved' // Set to approved so it shows on admin panel
        });
        
        const savedShop = await newShop.save();
        shopId = savedShop._id;
        
        // Update user with shopId
        await User.findByIdAndUpdate(userId, { shopId });
        
        console.log(`Created shop: ${demoData.shop.name}`);
      }
      
      // Add products to the shop
      for (const productData of demoData.products) {
        // Check if product already exists
        const existingProduct = await Product.findOne({ 
          name: productData.name,
          shop: shopId
        });
        
        if (existingProduct) {
          console.log(`Product "${productData.name}" already exists for shop ${demoData.shop.name}`);
        } else {
          // Create product
          const newProduct = new Product({
            ...productData,
            shop: shopId
          });
          
          await newProduct.save();
          console.log(`Added product: ${productData.name} to ${demoData.shop.name}`);
        }
      }
      
      console.log(`\nShop Details for ${demoData.shop.name}:`);
      console.log(`Email: ${demoData.user.email}`);
      console.log(`Password: ${demoData.user.password}`);
      console.log('-----------------------------------\n');
    }
    
    console.log('All demo shops and products created successfully!');
    
  } catch (error) {
    console.error('Error creating demo shops and products:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the function
createDemoShopsAndProducts();
