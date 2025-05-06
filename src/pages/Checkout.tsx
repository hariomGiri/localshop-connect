import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cash_on_delivery',
    notes: ''
  });

  // Calculate totals
  const calculateTax = (subtotal: number) => subtotal * 0.08; // 8% tax
  const calculateDeliveryFee = (subtotal: number) => subtotal > 50 ? 0 : 5.99;

  const tax = calculateTax(cart.total);
  const deliveryFee = calculateDeliveryFee(cart.total);
  const total = cart.total + tax + deliveryFee;

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle radio button changes
  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Validate pre-order date if selected
    if (isPreOrder && !expectedDeliveryDate) {
      toast({
        title: "Missing information",
        description: "Please select an expected delivery date for pre-order",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          product: {
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            category: item.category
          },
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        shops: Object.values(itemsByShop).map(shop => ({
          shopId: shop.shopId,
          shopName: shop.shopName,
          subtotal: shop.subtotal
        })),
        subtotal: cart.total,
        tax,
        deliveryFee,
        total,
        orderType: isPreOrder ? 'pre-order' : 'regular',
        expectedDeliveryDate: isPreOrder ? new Date(expectedDeliveryDate).toISOString() : undefined,
        paymentMethod: formData.paymentMethod,
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        notes: formData.notes
      };

      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to place an order",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Send order to API
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Clear cart and show success message
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.data._id} has been placed.`,
      });

      // Redirect to order confirmation page
      navigate('/order-confirmation', { state: { orderId: data.data._id } });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for pre-order (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Calculate maximum date for pre-order (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {cart.items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">
                You need to add items to your cart before checkout.
              </p>
              <Button asChild size="lg">
                <a href="/shops">Browse Shops</a>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Information */}
                <div className="lg:col-span-2 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        defaultValue="cash_on_delivery"
                        value={formData.paymentMethod}
                        onValueChange={handleRadioChange}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                          <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card">Credit Card (Pay Online)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="pre-order"
                          checked={isPreOrder}
                          onCheckedChange={setIsPreOrder}
                        />
                        <Label htmlFor="pre-order">Pre-order for future delivery</Label>
                      </div>

                      {isPreOrder && (
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="expected-delivery-date">Expected Delivery Date</Label>
                          <Input
                            id="expected-delivery-date"
                            type="date"
                            min={minDate}
                            max={maxDateStr}
                            value={expectedDeliveryDate}
                            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                            required={isPreOrder}
                          />
                          <p className="text-sm text-muted-foreground">
                            Select a date between tomorrow and 30 days from now
                          </p>
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Special instructions for delivery or preparation"
                          value={formData.notes}
                          onChange={handleChange}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="sticky top-8">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Items summary */}
                      <div className="space-y-4">
                        {Object.values(itemsByShop).map(shop => (
                          <div key={shop.shopId} className="space-y-2">
                            <h3 className="font-medium">{shop.shopName}</h3>
                            {shop.items.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-medium pt-1">
                              <span>Shop Subtotal</span>
                              <span>{formatCurrency(shop.subtotal)}</span>
                            </div>
                            <Separator />
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(cart.total)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Tax (8%)</span>
                          <span>{formatCurrency(tax)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Delivery Fee</span>
                          <span>
                            {cart.total > 50
                              ? 'Free'
                              : formatCurrency(deliveryFee)}
                          </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Place ${isPreOrder ? 'Pre-Order' : 'Order'}`
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By placing your order, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
