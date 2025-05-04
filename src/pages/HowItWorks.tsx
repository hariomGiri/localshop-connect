
import React from 'react';
import { useIsVisible } from '@/hooks/useIsVisible';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Store, Search, ShoppingBag, Truck, Star, Users } from 'lucide-react';

const HowItWorks = () => {
  const [isVisible1, ref1] = useIsVisible();
  const [isVisible2, ref2] = useIsVisible();
  const [isVisible3, ref3] = useIsVisible();
  
  const steps = [
    {
      id: 1,
      title: "For Customers",
      description: "Discover and shop from local businesses in your neighborhood.",
      icon: Search,
      steps: [
        "Browse shops and products near you based on your location",
        "Compare prices and availability across multiple stores",
        "Place orders for delivery or in-store pickup",
        "Track orders in real-time from preparation to delivery",
        "Rate and review your shopping experience"
      ],
      buttonText: "Start Shopping",
      buttonLink: "/shops",
      ref: ref1,
      isVisible: isVisible1
    },
    {
      id: 2,
      title: "For Shop Owners",
      description: "Bring your local store online and reach more customers.",
      icon: Store,
      steps: [
        "Create your shop profile with business details and operating hours",
        "List your products with images, prices, and inventory levels",
        "Manage orders and update statuses in real-time",
        "Access insights and analytics about your shop performance",
        "Connect with your community and build your online presence"
      ],
      buttonText: "Register Your Shop",
      buttonLink: "/register?type=shop",
      ref: ref2,
      isVisible: isVisible2
    },
    {
      id: 3,
      title: "For Communities",
      description: "Strengthen local economies and build connected neighborhoods.",
      icon: Users,
      steps: [
        "Support local businesses and keep money in your community",
        "Reduce environmental impact with shorter supply chains",
        "Discover unique products not found in big retail chains",
        "Build relationships with local shopkeepers and neighbors",
        "Create a vibrant, sustainable local economy"
      ],
      buttonText: "Learn More",
      buttonLink: "/",
      ref: ref3,
      isVisible: isVisible3
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero section */}
        <div className="bg-primary text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-6">
              How ShowcaseConnect Works
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Our platform connects local shopkeepers with customers in their neighborhood, 
              creating a digital marketplace with a community feel.
            </p>
          </div>
        </div>
        
        {/* Platform steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col space-y-20 md:space-y-32">
            {steps.map((step) => (
              <div 
                key={step.id}
                // Fix the ref type by casting it to any to avoid type errors
                ref={step.ref as React.LegacyRef<HTMLDivElement>}
                className={`flex flex-col md:flex-row md:items-center gap-8 lg:gap-12 ${
                  step.isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
              >
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-display">{step.title}</h2>
                  </div>
                  <p className="text-lg md:text-xl text-gray-600 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {step.steps.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm font-medium">{idx + 1}</span>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={step.buttonLink}>
                    <Button size="lg">{step.buttonText}</Button>
                  </Link>
                </div>
                <div className="md:w-1/2 bg-white p-8 rounded-xl border shadow-sm">
                  {step.id === 1 && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Discover Local Shops</h3>
                        <p className="text-gray-500">Find stores near you and browse their products</p>
                      </div>
                    </div>
                  )}
                  {step.id === 2 && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Store className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Manage Your Shop</h3>
                        <p className="text-gray-500">Create listings, update inventory, and process orders</p>
                      </div>
                    </div>
                  )}
                  {step.id === 3 && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Build Community</h3>
                        <p className="text-gray-500">Support local businesses and strengthen neighborhoods</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Platform benefits section */}
        <div className="bg-gray-100 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12">Key Platform Features</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Shop Profiles</h3>
                <p className="text-gray-600">Complete business profiles with details, operating hours, and policies</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Product Management</h3>
                <p className="text-gray-600">Easily list, update, and manage product inventory in real-time</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Delivery Options</h3>
                <p className="text-gray-600">Flexible delivery and pickup options for customer convenience</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ratings & Reviews</h3>
                <p className="text-gray-600">Build trust through customer feedback and shop owner responses</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Get started CTA */}
        <div className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Join ShowcaseConnect today and be part of the movement to support local businesses 
              and create stronger communities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="default">
                  Create Your Account
                </Button>
              </Link>
              <Link to="/register?type=shop">
                <Button size="lg" variant="outline">
                  Register Your Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
