import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: '/images/default-product.jpg'
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'Product must belong to a shop']
  },
  inStock: {
    type: Boolean,
    default: function() {
      return this.stock > 0;
    }
  },
  isAvailableForDelivery: {
    type: Boolean,
    default: true
  },
  isAvailableForPickup: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update inStock based on stock quantity
  this.inStock = this.stock > 0;
  
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
