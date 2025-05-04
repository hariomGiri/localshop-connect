
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  MessageSquare,
  Heart,
  Share2,
  Truck,
  ShoppingBag,
  Filter,
  LayoutGrid,
  List,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Organic Fresh Apples',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Fruits',
    inStock: true
  },
  {
    id: '2',
    name: 'Whole Grain Artisan Bread',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Bakery',
    inStock: true
  },
  {
    id: '3',
    name: 'Locally Sourced Honey',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Pantry',
    inStock: true
  },
  {
    id: '4',
    name: 'Premium Coffee Beans',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1625021659159-f63f546d74a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    inStock: false
  },
  {
    id: '5',
    name: 'Organic Vegetables Mix',
    price: 7.49,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Vegetables',
    inStock: true
  },
  {
    id: '6',
    name: 'Handmade Chocolate Truffles',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10918?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Sweets',
    inStock: true
  }
];

// Mock shop data
const mockShop = {
  id: '1',
  name: 'Green Market Fresh',
  description: 'A family-owned grocery store specializing in locally sourced, organic produce and artisanal goods. We partner with local farmers and producers to bring you the freshest products.',
  imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  rating: 4.7,
  reviewCount: 128,
  category: 'Grocery',
  tags: ['Organic', 'Local Produce', 'Vegan Options', 'Sustainable'],
  openingHours: {
    monday: '8:00 AM - 8:00 PM',
    tuesday: '8:00 AM - 8:00 PM',
    wednesday: '8:00 AM - 8:00 PM',
    thursday: '8:00 AM - 8:00 PM',
    friday: '8:00 AM - 9:00 PM',
    saturday: '9:00 AM - 7:00 PM',
    sunday: '10:00 AM - 6:00 PM',
  },
  address: '123 Local St, Downtown, Seattle, WA 98101',
  phone: '+1 (234) 567-8900',
  website: 'www.greenmarketfresh.com',
  isOpen: true,
  deliveryOptions: ['In-store pickup', 'Local delivery']
};

const Shop = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('products');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const { addItem, isInCart } = useCart();

  // This would normally fetch the shop data based on the ID
  const shop = mockShop;

  // Handle adding product to cart
  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addItem({
      id: product.id,
      shopId: shop.id,
      shopName: shop.name,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Helper function to render button text
  const getButtonText = (product: typeof mockProducts[0], compact = false) => {
    if (!product.inStock) {
      return 'Notify Me';
    }

    if (isInCart(product.id)) {
      return (
        <span className="flex items-center">
          <Check className="h-4 w-4 mr-2" />
          {compact ? 'Added' : 'Added to Cart'}
        </span>
      );
    }

    return 'Add to Cart';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Shop Cover Image */}
        <div className="relative h-64 md:h-80 w-full">
          <img
            src={shop.coverImage}
            alt={`${shop.name} store`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Shop info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
            <div className="relative overflow-hidden rounded-xl border-4 border-white mr-5 shadow-lg">
              <img
                src={shop.logo}
                alt={shop.name}
                className="w-20 h-20 md:w-24 md:h-24 object-cover bg-white"
              />
            </div>
            <div className="text-white">
              <div className="flex items-center mb-1">
                <Badge className="bg-green-500/90 text-white mr-2">
                  {shop.isOpen ? 'Open Now' : 'Closed'}
                </Badge>
                <Badge className="bg-white/90 text-foreground">
                  {shop.category}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{shop.name}</h1>
              <div className="flex items-center mt-1">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{shop.rating}</span>
                  <span className="text-white/70 ml-1">({shop.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-white/90">Seattle, WA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop details and products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column: Shop details */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About {shop.name}</h2>
                <p className="text-muted-foreground mb-6">{shop.description}</p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">{shop.address}</p>
                      <Button variant="link" className="p-0 h-auto text-primary">Get directions</Button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <p className="text-muted-foreground">Today: {shop.openingHours.monday}</p>
                      <Button variant="link" className="p-0 h-auto text-primary">See all hours</Button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">{shop.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Website</h3>
                      <a
                        href={`https://${shop.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {shop.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Delivery Options</h3>
                  <div className="space-y-2">
                    {shop.deliveryOptions.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <Truck className="h-4 w-4 text-primary mr-2" />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex space-x-2">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Shop Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {shop.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Products */}
            <div className="lg:w-2/3">
              <Tabs defaultValue="products" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="flex justify-between items-center mb-6">
                  <TabsList>
                    <TabsTrigger value="products" className="text-base">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Products
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="text-base">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reviews
                    </TabsTrigger>
                  </TabsList>

                  {activeTab === 'products' && (
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                      <div className="flex border rounded-md overflow-hidden">
                        <button
                          className={`p-2 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'bg-white'}`}
                          onClick={() => setViewMode('grid')}
                          aria-label="Grid view"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                          className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'bg-white'}`}
                          onClick={() => setViewMode('list')}
                          aria-label="List view"
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <TabsContent value="products">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {mockProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
                          <div className="aspect-square overflow-hidden relative">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="px-3 py-1.5 bg-white/90 rounded-md text-sm font-medium">Out of Stock</span>
                              </div>
                            )}
                            <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
                            <Button
                              className="w-full mt-3"
                              disabled={!product.inStock}
                              onClick={() => product.inStock && handleAddToCart(product)}
                            >
                              {getButtonText(product)}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockProducts.map((product) => (
                        <div key={product.id} className="flex bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
                          <div className="w-40 h-40 overflow-hidden relative flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="px-3 py-1.5 bg-white/90 rounded-md text-sm font-medium">Out of Stock</span>
                              </div>
                            )}
                            <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
                              <Button
                                className="w-auto"
                                disabled={!product.inStock}
                                onClick={() => product.inStock && handleAddToCart(product)}
                              >
                                {getButtonText(product, true)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="bg-white rounded-xl p-6 border mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-semibold">Customer Reviews</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(shop.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill={i < Math.floor(shop.rating) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <span className="ml-2 font-medium">{shop.rating} out of 5</span>
                          <span className="ml-2 text-muted-foreground">({shop.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <Button>Write a Review</Button>
                    </div>

                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Reviews will be displayed here.</p>
                      <p className="text-muted-foreground">Be the first to review this shop!</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
