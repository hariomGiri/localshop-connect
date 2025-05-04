
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Store, ShieldCheck, MessageCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold font-display mb-6">About ShowcaseConnect</h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              Bridging the gap between local retailers and digital consumers to create a vibrant community marketplace.
            </p>
          </div>
        </section>
        
        {/* Mission section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Local marketplace" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  ShowcaseConnect was founded with a simple yet powerful mission: to strengthen local economies by connecting neighborhood shops with digital consumers.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We believe that local businesses are the backbone of our communities, providing unique products, personalized service, and authentic experiences that cannot be replicated by big-box retailers.
                </p>
                <p className="text-lg text-gray-700">
                  Our platform empowers small businesses with digital tools that level the playing field, while giving consumers a way to discover, support and connect with the best local shops in their area.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Local First</h3>
                <p className="text-gray-600">
                  We prioritize the success of local businesses and believe in the power of community-based commerce.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Focused</h3>
                <p className="text-gray-600">
                  We build connections between shop owners and customers that strengthen neighborhood ties.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust & Quality</h3>
                <p className="text-gray-600">
                  We maintain high standards for the shops and products on our platform to ensure customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Founder & CEO',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                  name: 'David Chen',
                  role: 'CTO',
                  image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                  name: 'Priya Sharma',
                  role: 'Head of Shop Relations',
                  image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                  name: 'Marcus Williams',
                  role: 'Head of Customer Experience',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                }
              ].map(member => (
                <div key={member.name} className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="bg-primary/10 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-gray-700 mb-8">
              Whether you're a shop owner looking to expand your reach or a customer wanting to support local businesses, ShowcaseConnect is for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/register?type=shop">Register Your Shop</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shops">Explore Local Shops</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Contact section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 rounded-xl shadow-sm border">
              <div>
                <h2 className="text-2xl font-bold mb-2">Have Questions?</h2>
                <p className="text-gray-600 mb-0">
                  Our team is here to help you with anything you need.
                </p>
              </div>
              <Button asChild className="flex items-center gap-2">
                <Link to="/contact">
                  <MessageCircle className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
