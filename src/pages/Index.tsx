
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <ShopSection />
        
        {/* Additional section: How It Works */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 rounded-full mb-4">
              <span className="text-sm font-medium text-primary">How It Works</span>
            </div>
            <h2 className="heading-lg mb-4">Connecting Communities Through Commerce</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">
              ShowcaseConnect makes it simple to discover, compare, and shop from local businesses in your neighborhood.
            </p>
            
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Discover Local Shops</h3>
                <p className="text-muted-foreground">
                  Find shops near you through geolocation search and browse their products in real-time.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Compare & Choose</h3>
                <p className="text-muted-foreground">
                  Compare prices, read reviews, and find the best products and services for your needs.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Shop With Confidence</h3>
                <p className="text-muted-foreground">
                  Order for pickup or delivery, knowing you're supporting local businesses in your community.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 bg-primary">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
              Ready to Showcase Your Shop?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Join thousands of local businesses already thriving on our platform. It's free to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/register?type=shop" 
                className="px-6 py-3 bg-white text-primary rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Register Your Shop
              </a>
              <a 
                href="/how-it-works" 
                className="px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
