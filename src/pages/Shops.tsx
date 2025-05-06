import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopCard, { Shop } from '@/components/ShopCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { shopAPI } from '@/lib/api';
import { useLocation } from '@/contexts/LocationContext';

// Mock shop data with all required properties according to Shop type
const mockShops = [
  {
    id: '1',
    name: 'Green Market Fresh',
    description: 'A family-owned grocery store specializing in locally sourced, organic produce and artisanal goods.',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 128,
    category: 'grocery',
    location: 'Seattle, WA',
    distance: '0.8 miles',
    address: '123 Local St, Downtown',
    isOpen: true,
    products: 245,
    tags: ['Organic', 'Local Produce', 'Fresh']
  },
  {
    id: '2',
    name: 'Tech Haven',
    description: 'Your neighborhood electronics store with the latest gadgets and tech accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviewCount: 96,
    category: 'electronics',
    location: 'Seattle, WA',
    distance: '1.2 miles',
    address: '456 Tech Ave, Midtown',
    isOpen: true,
    products: 320,
    tags: ['Gadgets', 'Accessories', 'Repairs']
  },
  {
    id: '3',
    name: 'Artisan Bakery',
    description: 'Fresh bread, pastries and cakes made daily using traditional methods and quality ingredients.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 214,
    category: 'bakery',
    location: 'Seattle, WA',
    distance: '0.5 miles',
    address: '78 Main St, Downtown',
    isOpen: true,
    products: 56,
    tags: ['Bread', 'Pastries', 'Desserts']
  },
  {
    id: '4',
    name: 'Fashion Forward',
    description: 'Curated clothing collections from local designers and sustainable fashion brands.',
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.3,
    reviewCount: 85,
    category: 'fashion',
    location: 'Seattle, WA',
    distance: '1.7 miles',
    address: '221 Style Ave, Uptown',
    isOpen: false,
    products: 189,
    tags: ['Clothing', 'Accessories', 'Sustainable']
  },
  {
    id: '5',
    name: 'Home & Garden Center',
    description: 'Everything you need to transform your house into a beautiful and comfortable home.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 112,
    category: 'homegoods',
    location: 'Seattle, WA',
    distance: '2.1 miles',
    address: '543 Home Blvd, Suburbs',
    isOpen: true,
    products: 412,
    tags: ['Home Decor', 'Garden', 'Furniture']
  },
  {
    id: '6',
    name: 'Book Nook',
    description: 'A cozy independent bookstore with a thoughtfully curated collection of classics and new releases.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 173,
    category: 'books',
    location: 'Seattle, WA',
    distance: '1.0 miles',
    address: '89 Reader Lane, Downtown',
    isOpen: true,
    products: 2500,
    tags: ['Books', 'Stationery', 'Coffee Shop']
  }
];

// Category display mapping
const categoryMapping = {
  'all': 'All',
  'grocery': 'Grocery',
  'electronics': 'Electronics',
  'fashion': 'Fashion',
  'homegoods': 'Home & Garden',
  'bakery': 'Bakery',
  'books': 'Books',
  'other': 'Other'
};

// Categories for filtering - must match backend values
const categories = ['all', 'grocery', 'electronics', 'fashion', 'books', 'bakery', 'homegoods', 'other'];

const Shops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { location, address, loading: locationLoading, error: locationError, refreshLocation } = useLocation();

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);

        // For demonstration purposes, always use mock data
        setShops(mockShops);

        // Only show toast on first load
        if (shops.length === 0) {
          toast({
            title: "Sample Shops",
            description: "Showing sample shop data for demonstration purposes",
            variant: "default"
          });
        }

      } catch (error) {
        console.error("Error:", error);
        // Ensure mock data is used as fallback
        setShops(mockShops);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [toast]);

  // Helper function to get location status text
  const getLocationStatusText = () => {
    if (locationLoading) {
      return 'Getting location...';
    }

    if (locationError) {
      return 'Location unavailable';
    }

    return address || 'No location set';
  };

  // Filter shops based on search term and category
  const filteredShops = shops.filter(shop => {
    // For search, check if shop name, description, or tags include the search term
    const matchesSearch = searchTerm === '' ||
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // For category, check if it matches the selected category
    const matchesCategory = selectedCategory === 'all' || shop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold font-display mb-4">Discover Local Shops</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find and support local businesses in your area. Compare products, read reviews, and shop with confidence.
            </p>
          </div>

          {/* Search and filter bar */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search shops by name or product..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
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
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {getLocationStatusText()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={refreshLocation}
                  disabled={locationLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${locationLoading ? 'animate-spin' : ''}`} />
                </Button>
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

                    // Update URL search parameters
                    const newParams = new URLSearchParams(searchParams);
                    if (category !== 'all') {
                      newParams.set('category', category);
                    } else {
                      newParams.delete('category');
                    }
                    setSearchParams(newParams);
                  }}
                  className="rounded-full"
                >
                  {categoryMapping[category as keyof typeof categoryMapping]}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" aria-hidden="true">
              </div>
              <p className="mt-4 text-xl text-gray-500">Loading shops...</p>
            </div>
          )}

          {/* Shop listings */}
          {!loading && filteredShops.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && filteredShops.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No shops found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shops;
