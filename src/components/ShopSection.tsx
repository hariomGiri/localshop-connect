
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ShopCard, { Shop } from './ShopCard';
import { useIsVisible } from '@/hooks/useIsVisible';
import { MapPin, Filter, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { shopAPI } from '@/lib/api';

// Mock data for shops
const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Green Market Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 128,
    category: 'Grocery',
    distance: '0.7 miles',
    address: '123 Local St, Downtown',
    isOpen: true,
    products: 245,
    tags: ['Organic', 'Local Produce', 'Vegan Options']
  },
  {
    id: '2',
    name: 'Artisan Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 213,
    category: 'Bakery',
    distance: '0.9 miles',
    address: '78 Main St, Downtown',
    isOpen: true,
    products: 62,
    tags: ['Fresh Bread', 'Pastries', 'Gluten-Free']
  },
  {
    id: '3',
    name: 'Tech Haven Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviewCount: 98,
    category: 'Electronics',
    distance: '1.2 miles',
    address: '456 Tech Blvd, Midtown',
    isOpen: false,
    products: 187,
    tags: ['Gadgets', 'Computer Parts', 'Repair Service']
  },
  {
    id: '4',
    name: 'Fashion Forward',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 156,
    category: 'Clothing',
    distance: '1.5 miles',
    address: '789 Style Ave, Uptown',
    isOpen: true,
    products: 312,
    tags: ['Trendy', 'Sustainable', 'Local Designers']
  }
];

const categories = [
  'All',
  'Grocery',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Bakery',
  'Books'
];

const ShopSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isVisible, ref] = useIsVisible({ threshold: 0.1 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await shopAPI.getShops();

        if (response.success && response.data) {
          // Transform API data to match Shop interface
          const apiShops = response.data.map((shop: any) => ({
            id: shop._id,
            name: shop.name,
            imageUrl: shop.imageUrl ?? 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Default image if none provided
            rating: shop.rating ?? 4.5,
            reviewCount: shop.reviewCount ?? 0,
            category: shop.category,
            distance: '1.0 miles', // This would need to be calculated based on user location
            address: shop.address?.street ? `${shop.address.street}, ${shop.address.city}` : 'Address not available',
            isOpen: true, // This would need to be determined based on shop hours
            products: shop.productCount ?? 0,
            tags: shop.tags ?? [shop.category]
          }));

          if (selectedCategory === 'All') {
            setFilteredShops(apiShops);
          } else {
            setFilteredShops(apiShops.filter((shop: Shop) => shop.category === selectedCategory));
          }
        } else {
          // If API call fails, use mock data as fallback
          if (selectedCategory === 'All') {
            setFilteredShops(mockShops);
          } else {
            setFilteredShops(mockShops.filter(shop => shop.category === selectedCategory));
          }

          toast({
            title: "Notice",
            description: "Using demo data as we couldn't fetch shops from the server",
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        // Use mock data as fallback
        if (selectedCategory === 'All') {
          setFilteredShops(mockShops);
        } else {
          setFilteredShops(mockShops.filter(shop => shop.category === selectedCategory));
        }

        toast({
          title: "Error",
          description: "Failed to load shops. Using demo data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [selectedCategory, toast]);

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
              <span className="text-sm font-medium text-primary">Featured Shops</span>
            </div>
            <h2 className="heading-lg mb-3">Discover Nearby Shops</h2>
            <p className="text-muted-foreground max-w-2xl">
              Browse and connect with local businesses in your area offering quality products and services.
            </p>
          </div>

          <Link to="/shops">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              View All Shops
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Location and filter controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          {/* Current location */}
          <div className="flex items-center mb-4 sm:mb-0">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">Seattle, Washington</span>
            <Button variant="link" className="text-primary p-0 ml-2 h-auto">
              Change
            </Button>
          </div>

          {/* Filter button */}
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category selector */}
        <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar">
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

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" aria-hidden="true">
            </div>
            <p className="mt-4 text-lg font-medium">Loading shops...</p>
          </div>
        )}

        {/* Shops grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShops.map((shop, index) => (
              <div
                key={shop.id}
                className={`${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ShopCard shop={shop} featured={index === 0} />
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && filteredShops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">No shops found</p>
            <p className="text-muted-foreground">
              Try changing your category or location filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;
