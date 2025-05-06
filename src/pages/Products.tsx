
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Tag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { getProductFallbackImage } from '@/utils/imageUtils';

// Mock product data
const mockProducts = [
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

const ProductCard = ({ product }: { product: typeof mockProducts[0] }) => {
  const [isPrebooking, setPrebooking] = useState(false);

  const handlePrebook = () => {
    setPrebooking(true);
    setTimeout(() => {
      setPrebooking(false);
      // Simulate successful prebooking
      alert(`Successfully prebooked ${product.name}! We'll notify you when it's available.`);
    }, 1000);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform transition hover:scale-105"
          onError={(e) => {
            // If image fails to load, use a category-specific fallback image
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop

            // Use the utility function to get a category-specific fallback image
            target.src = getProductFallbackImage(product.category);
          }}
        />
      </div>
      <CardContent className="py-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <span className="font-bold text-primary">₹{product.price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">{product.shop}</span>
          <span className="flex items-center text-sm">
            ★ {product.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-auto">
          {product.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 px-6 pb-6">
        <div className="w-full flex gap-2">
          <Button className="flex-1">
            {product.inStock ? 'Add to Cart' : 'View Details'}
          </Button>
          {!product.inStock && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handlePrebook}
              disabled={isPrebooking}
            >
              {isPrebooking ? 'Processing...' : 'Pre-book'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
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
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Product listings */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No products found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
