
import { useEffect, useRef } from 'react';
import { useIsVisible } from '@/hooks/useIsVisible';
import { 
  Store, 
  Clock, 
  Map, 
  Star, 
  Truck,
  ShoppingBag, 
  BarChart, 
  Search 
} from 'lucide-react';

const features = [
  {
    icon: <Store className="h-6 w-6" />,
    title: "Shop Profile Management",
    description: "Create and manage digital storefronts with product catalogs, operating hours, and business details."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-Time Inventory",
    description: "Keep customers informed with automatically updated stock levels and availability notifications."
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: "Geolocation Search",
    description: "Find nearby shops and products easily with location-based search and comparison tools."
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Reviews & Ratings",
    description: "Build trust with verified customer reviews and ratings for shops and products."
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Flexible Delivery Options",
    description: "Choose between local delivery, in-store pickup, or pre-booking your shopping experience."
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description: "Shopkeepers gain valuable insights with comprehensive sales, traffic, and inventory analytics."
  }
];

const Features = () => {
  const [isVisible, ref] = useIsVisible({ threshold: 0.1 });
  
  return (
    <section className="py-20 px-6" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">Platform Features</span>
          </div>
          <h2 className="heading-lg mb-4">Everything You Need To Connect <br className="hidden md:block" />Shop Owners With Customers</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform bridges the gap between traditional retail and e-commerce, providing powerful tools for both shopkeepers and customers.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-200 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
