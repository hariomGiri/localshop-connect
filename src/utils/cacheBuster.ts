/**
 * Utility functions for cache busting in the application
 */

/**
 * Clear the browser cache for specific image URLs
 * This function can be called when images are updated to force a refresh
 * 
 * @param imageUrls Array of image URLs to clear from cache
 */
export const clearImageCache = (imageUrls: string[]): void => {
  // For each URL, create a new Image object and set cache-busting parameters
  imageUrls.forEach(url => {
    if (!url.startsWith('http')) return;
    
    // Add a cache-busting parameter to the URL
    const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}cache=${new Date().getTime()}`;
    
    // Create a new image to force the browser to load the new version
    const img = new Image();
    img.src = cacheBustUrl;
  });
};

/**
 * Clear all image caches for a specific shop
 * This is useful when updating shop profile images
 * 
 * @param shopId The ID of the shop to clear images for
 */
export const clearShopImageCache = (shopId: string): void => {
  // Get all image elements on the page that might contain shop images
  const images = document.querySelectorAll('img');
  
  // Filter for images that might be related to this shop
  const shopImages = Array.from(images)
    .filter(img => {
      const src = img.getAttribute('src') || '';
      // Check if the image URL contains the shop ID or is from the uploads/shops directory
      return (src.includes(shopId) || src.includes('uploads/shops'));
    })
    .map(img => img.getAttribute('src') || '');
  
  // Clear the cache for these images
  clearImageCache(shopImages);
};

/**
 * Add a cache-busting parameter to a URL
 * 
 * @param url The URL to add a cache-busting parameter to
 * @returns The URL with a cache-busting parameter
 */
export const addCacheBuster = (url: string): string => {
  if (!url || url.startsWith('data:')) return url;
  
  // If it's an external URL that doesn't point to our server, return as is
  if (url.startsWith('http') && !url.includes('localhost:5001')) {
    return url;
  }
  
  // Add a cache-busting parameter
  return `${url}${url.includes('?') ? '&' : '?'}nocache=${new Date().getTime()}`;
};

/**
 * Force reload all images on the current page
 * This is a more aggressive approach to clear the cache
 */
export const forceReloadAllImages = (): void => {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      img.setAttribute('src', addCacheBuster(src));
    }
  });
};
