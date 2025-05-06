
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsVisible } from '@/hooks/useIsVisible';
import { Search, MapPin, ShoppingBag, Store, Loader2 } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';

const Hero = () => {
  const [isImageVisible, imageRef] = useIsVisible({ threshold: 0.1 });
  const [isTextVisible, textRef] = useIsVisible({ threshold: 0.1 });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { location, loading: locationLoading } = useLocation();

  // Focus search input when text becomes visible
  useEffect(() => {
    if (isTextVisible && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 1200);

      return () => clearTimeout(timeoutId);
    }
  }, [isTextVisible]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current?.value) {
      // Navigate to shops page with search query
      navigate(`/shops?search=${encodeURIComponent(searchInputRef.current.value)}`);
    }
  };

  const featureChips = [
    { icon: <Store className="h-4 w-4" />, text: "Local shops" },
    { icon: <ShoppingBag className="h-4 w-4" />, text: "Real-time inventory" },
    { icon: <MapPin className="h-4 w-4" />, text: "Nearby delivery" }
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-16 px-6 flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>

      {/* Animated blob */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float -z-10"></div>
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow -z-10"></div>

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left column: Text content */}
        <div
          ref={textRef as React.RefObject<HTMLDivElement>}
          className={`flex flex-col space-y-6 ${isTextVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="space-y-2">
            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full inline-flex items-center space-x-2 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-sm font-medium">Discover Local. Shop Smart.</span>
            </div>

            <h1 className="heading-xl">
              Your Local Shops,<br />
              <span className="text-gradient">Now Online</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-lg">
              Discover products from your neighborhood stores, compare prices, and get delivery or pickup options all in one platform.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-md mt-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search shops or products nearby..."
              className="pl-10 pr-12 py-3 w-full rounded-xl border bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none shadow-sm transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                className={`flex items-center justify-center ${locationLoading ? 'animate-pulse' : ''}`}
                title={location ? 'Using your location' : 'Enable location'}
              >
                {locationLoading ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <MapPin className={`h-5 w-5 ${location ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </button>
            </div>
          </form>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 mt-6">
            {featureChips.map((chip, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm transition-all animation-delay-${index*2} ${isTextVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{
                  animationDelay: `${800 + index * 200}ms`,
                  transitionDelay: `${800 + index * 200}ms`
                }}
              >
                {chip.icon}
                <span className="text-sm font-medium">{chip.text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/shops">
              <Button
                className="button-primary w-full sm:w-auto bg-primary text-white"
                size="lg"
              >
                Explore Shops
              </Button>
            </Link>
            <Link to="/register?type=shop">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Register Your Shop
              </Button>
            </Link>
          </div>
        </div>

        {/* Right column: Image */}
        <div
          ref={imageRef as React.RefObject<HTMLDivElement>}
          className={`relative ${isImageVisible ? 'animate-fade-in' : 'opacity-0'}`}
          style={{ animationDelay: '200ms' }}
        >
          {/* Main image */}
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1523281353252-5e14672131b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Local shop with products"
              className="w-full h-auto object-cover"
              loading="eager"
              style={{ maxHeight: '600px' }}
            />
          </div>

          {/* Floating card elements */}
          <div
            className="absolute -bottom-6 -left-6 p-4 glass-card rounded-xl animate-float shadow-lg z-20"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Local Delivery</p>
                <p className="text-xs text-muted-foreground">12 stores nearby</p>
              </div>
            </div>
          </div>

          <div
            className="absolute top-10 -right-4 md:-right-8 p-4 glass-card rounded-xl animate-float shadow-lg z-20"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Store className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New Shop Added</p>
                <p className="text-xs text-muted-foreground">Green Market</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
