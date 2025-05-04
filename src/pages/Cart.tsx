import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, removeItem, updateQuantity, clearShopItems } = useCart();
  
  // Group items by shop
  const itemsByShop = cart.items.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = {
        shopId: item.shopId,
        shopName: item.shopName,
        items: [],
        subtotal: 0
      };
    }
    acc[item.shopId].items.push(item);
    acc[item.shopId].subtotal += item.price * item.quantity;
    return acc;
  }, {} as Record<string, { shopId: string; shopName: string; items: typeof cart.items; subtotal: number }>);
  
  // Calculate delivery fee (mock)
  const calculateDeliveryFee = (subtotal: number) => {
    return subtotal > 50 ? 0 : 5.99;
  };
  
  // Calculate tax (mock)
  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {cart.items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
                Browse our shops to find products you'll love.
              </p>
              <Button asChild size="lg">
                <Link to="/shops">Browse Shops</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-8">
                {Object.values(itemsByShop).map(shop => (
                  <Card key={shop.shopId} className="overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{shop.shopName}</h3>
                        <p className="text-sm text-gray-500">
                          {shop.items.length} {shop.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => clearShopItems(shop.shopId)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove All
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/shop/${shop.shopId}`}>
                            View Shop
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-0">
                      {shop.items.map((item, index) => (
                        <React.Fragment key={item.id}>
                          {index > 0 && <Separator />}
                          <div className="p-6 flex items-start gap-4">
                            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="font-semibold">
                                  {formatCurrency(item.price * item.quantity)}
                                </div>
                              </div>
                              
                              {item.category && (
                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                              )}
                              
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center border rounded-md">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  
                                  <span className="w-10 text-center text-sm">
                                    {item.quantity}
                                  </span>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-red-500"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    
                    <div className="space-y-4">
                      {Object.values(itemsByShop).map(shop => (
                        <div key={shop.shopId} className="flex justify-between text-sm">
                          <span>{shop.shopName} Subtotal</span>
                          <span>{formatCurrency(shop.subtotal)}</span>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">{formatCurrency(cart.total)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Estimated Tax</span>
                        <span>{formatCurrency(calculateTax(cart.total))}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>
                          {cart.total > 50 
                            ? 'Free' 
                            : formatCurrency(calculateDeliveryFee(cart.total))}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            cart.total + 
                            calculateTax(cart.total) + 
                            calculateDeliveryFee(cart.total)
                          )}
                        </span>
                      </div>
                      
                      <Button className="w-full mt-4" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Taxes and shipping calculated at checkout
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
