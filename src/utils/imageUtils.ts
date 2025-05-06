/**
 * Utility functions for handling images in the application
 */

/**
 * Get a category-specific fallback image URL for shops
 * @param category The shop category
 * @returns URL for a fallback image appropriate for the category
 */
export const getShopFallbackImage = (category: string): string => {
  const categoryImageMap: Record<string, string> = {
    'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'fashion': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'bakery': 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'homegoods': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'other': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  return categoryImageMap[category] || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
};

/**
 * Get a category-specific fallback image URL for products
 * @param category The product category
 * @returns URL for a fallback image appropriate for the category
 */
export const getProductFallbackImage = (category: string): string => {
  const categoryImageMap: Record<string, string> = {
    'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Vegetables': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Pantry': 'https://images.unsplash.com/photo-1584473457406-6240486418e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Confectionery': 'https://images.unsplash.com/photo-1548907040-4d42bfc87a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Fashion': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'audio': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'accessories': 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'ethnic wear': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  return categoryImageMap[category] || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
};

/**
 * Get the full image URL for an image path
 * @param imagePath The image path from the server
 * @param category The category for fallback image if path is invalid
 * @param type 'product' or 'shop' to determine which fallback to use
 * @param bustCache Whether to add a cache-busting parameter to the URL
 * @returns The full image URL
 */
export const getImageUrl = (
  imagePath: string | undefined,
  category: string,
  type: 'product' | 'shop',
  bustCache: boolean = true
): string => {
  if (!imagePath) {
    // Use appropriate fallback based on type
    return type === 'product'
      ? getProductFallbackImage(category)
      : getShopFallbackImage(category);
  }

  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Clean up the path to ensure it doesn't have any absolute path components
  let cleanPath = imagePath;

  // Remove any absolute path components (like A:/ or C:/)
  if (/^[A-Za-z]:\\/.test(cleanPath) || cleanPath.includes(':\\')) {
    // Extract just the filename from the path
    const parts = cleanPath.split(/[/\\]/);
    cleanPath = parts[parts.length - 1];
  }

  // Ensure the path starts with 'uploads/' if it doesn't already
  if (!cleanPath.startsWith('uploads/')) {
    // Check if it's in a subdirectory of uploads
    if (type === 'product' && !cleanPath.includes('products/')) {
      cleanPath = `uploads/products/${cleanPath}`;
    } else if (type === 'shop' && !cleanPath.includes('shops/')) {
      cleanPath = `uploads/shops/${cleanPath}`;
    } else {
      cleanPath = `uploads/${cleanPath}`;
    }
  }

  // For server-stored images, use the full path
  const baseUrl = `http://localhost:5001/${cleanPath}`;

  // Add cache-busting parameter if requested
  return bustCache ? `${baseUrl}?nocache=${new Date().getTime()}` : baseUrl;
};
