
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProductCard, { Product } from '@/components/ProductCard';
import { productAPI } from '@/lib/api';
import { getImageUrl } from '@/utils/imageUtils';

// Mock product data for fallback
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Fresh Vegetables Bundle',
    description: 'A selection of seasonal organic vegetables sourced from local farms',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 1999,
    shop: 'Green Market Fresh',
    shopId: '1',
    category: 'Grocery',
    inStock: true,
    rating: 4.8,
    tags: ['Organic', 'Fresh', 'Local']
  },
  {
    id: '2',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 14999,
    shop: 'Tech Haven',
    shopId: '2',
    category: 'Electronics',
    inStock: true,
    rating: 4.7,
    tags: ['Wireless', 'Audio', 'Gadgets']
  },
  {
    id: '3',
    name: 'Artisan Sourdough Bread',
    description: 'Handcrafted sourdough bread made with a 100-year-old starter and organic flour',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 850,
    shop: 'Artisan Bakery',
    shopId: '3',
    category: 'Bakery',
    inStock: true,
    rating: 4.9,
    tags: ['Bread', 'Artisan', 'Fresh']
  },
  {
    id: '4',
    name: 'Sustainable Cotton T-shirt',
    description: 'Eco-friendly t-shirt made from 100% organic cotton with minimal environmental impact',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 2999,
    shop: 'Fashion Forward',
    shopId: '4',
    category: 'Fashion',
    inStock: false,
    rating: 4.5,
    tags: ['Sustainable', 'Clothing', 'Casual']
  },
  {
    id: '5',
    name: 'Indoor Plant Collection',
    description: 'Set of 3 easy-care indoor plants perfect for purifying air and adding greenery to your space',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 4999,
    shop: 'Home & Garden Center',
    shopId: '5',
    category: 'Home & Garden',
    inStock: true,
    rating: 4.6,
    tags: ['Plants', 'Home Decor', 'Indoor']
  },
  {
    id: '6',
    name: 'Bestseller Book Bundle',
    description: 'Collection of this month\'s top 3 bestselling fiction novels',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 4500,
    shop: 'Book Nook',
    shopId: '6',
    category: 'Books',
    inStock: true,
    rating: 4.8,
    tags: ['Books', 'Fiction', 'Bestsellers']
  }
];

// Categories
const categories = ['All', 'Grocery', 'Electronics', 'Fashion', 'Books', 'Bakery', 'Home & Garden'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Attempt to fetch products from API
        const response = await productAPI.getProducts();

        if (response.success && response.data) {
          // Transform API data to match Product interface
          const apiProducts = response.data.map((product: any) => {
            // Use the utility function to handle image URL properly with cache busting
            const imageUrl = getImageUrl(product.imageUrl, product.category, 'product', true);

            return {
              id: product._id,
              name: product.name,
              description: product.description,
              imageUrl: imageUrl,
              price: product.price,
              shop: product.shop?.name ?? 'Local Shop',
              shopId: product.shop?._id ?? '1',
              category: product.category,
              inStock: product.inStock,
              rating: 4.5, // Default rating if not provided
              tags: product.tags ?? [product.category]
            };
          });

          setProducts(apiProducts);
        } else {
          // If API call fails, use mock data as fallback
          setProducts(mockProducts);

          toast({
            title: "Notice",
            description: "Using demo product data as we couldn't fetch from the server",
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Use mock data as fallback
        setProducts(mockProducts);

        toast({
          title: "Error",
          description: "Failed to load products. Using demo data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Initialize search term and category from URL parameters when component mounts
  useEffect(() => {
    // Handle search parameter
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }

    // Handle category parameter
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // Update URL search parameters
    const newParams = new URLSearchParams(searchParams);
    if (newValue) {
      newParams.set('search', newValue);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' ||
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold font-display mb-4">Browse Products</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover unique products from local shops in your area
            </p>
          </div>

          {/* Search and filter bar */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products by name or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);

                    // Update URL category parameter
                    const newParams = new URLSearchParams(searchParams);
                    if (category !== 'All') {
                      newParams.set('category', category);
                    } else {
                      newParams.delete('category');
                    }
                    setSearchParams(newParams);
                  }}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" aria-hidden="true">
              </div>
              <p className="mt-4 text-lg font-medium">Loading products...</p>
            </div>
          )}

          {/* Product listings */}
          {!loading && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No products found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter settings.</p>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
