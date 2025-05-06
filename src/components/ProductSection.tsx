import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsVisible } from '@/hooks/useIsVisible';
import { ArrowRight, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProductCard, { Product } from './ProductCard';
import { productAPI } from '@/lib/api';

// Mock product data for fallback
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Fresh Apples',
    description: 'Locally sourced organic apples, perfect for healthy snacking',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 3.99,
    shop: 'Green Market Fresh',
    shopId: '1',
    category: 'Fruits',
    inStock: true,
    rating: 4.8,
    tags: ['Organic', 'Fresh', 'Local']
  },
  {
    id: '2',
    name: 'Whole Grain Artisan Bread',
    description: 'Freshly baked artisan bread made with organic whole grain flour',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 5.49,
    shop: 'Artisan Bakery',
    shopId: '2',
    category: 'Bakery',
    inStock: true,
    rating: 4.9,
    tags: ['Whole Grain', 'Freshly Baked', 'Artisan']
  },
  {
    id: '3',
    name: 'Locally Sourced Honey',
    description: 'Pure, raw honey from local beekeepers, perfect for tea or baking',
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 8.99,
    shop: 'Green Market Fresh',
    shopId: '1',
    category: 'Pantry',
    inStock: true,
    rating: 4.7,
    tags: ['Organic', 'Local', 'Raw']
  },
  {
    id: '4',
    name: 'Handmade Chocolate Truffles',
    description: 'Decadent chocolate truffles made with premium ingredients',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4d42bfc87a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 12.99,
    shop: 'Sweet Delights',
    shopId: '3',
    category: 'Confectionery',
    inStock: false,
    rating: 4.9,
    tags: ['Handmade', 'Premium', 'Gift']
  }
];

const categories = [
  'All',
  'Fruits',
  'Vegetables',
  'Bakery',
  'Dairy',
  'Pantry',
  'Confectionery'
];

const ProductSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isVisible, ref] = useIsVisible({ threshold: 0.1 });
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
          const apiProducts = response.data.map((product: any) => ({
            id: product._id,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: product.price,
            shop: product.shop?.name || 'Local Shop',
            shopId: product.shop?._id || '1',
            category: product.category,
            inStock: product.inStock,
            rating: 4.5, // Default rating if not provided
            tags: product.tags || [product.category]
          }));

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

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  return (
    <section
      className="py-20 px-6 bg-gray-50"
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div className="mb-6 md:mb-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 rounded-full mb-4">
              <span className="text-sm font-medium text-primary">Featured Products</span>
            </div>
            <h2 className="heading-lg mb-3">Discover Local Products</h2>
            <p className="text-muted-foreground max-w-2xl">
              Browse quality products from local shops in your area, from fresh produce to artisanal goods.
            </p>
          </div>

          <Link to="/products">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Filter controls */}
        <div className="flex justify-between items-center mb-8">
          {/* Category selector */}
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white border hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter button */}
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" aria-hidden="true">
            </div>
            <p className="mt-4 text-lg font-medium">Loading products...</p>
          </div>
        )}

        {/* Products grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-muted-foreground">
              Try changing your category filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
