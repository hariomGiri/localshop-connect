import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Truck, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

interface OrderData {
  _id: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
      category?: string;
    };
    quantity: number;
    subtotal: number;
  }>;
  shops: Array<{
    shopId: string;
    shopName: string;
    subtotal: number;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  orderType: 'regular' | 'pre-order';
  expectedDeliveryDate?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get orderId from location state or URL params
  const orderId = location.state?.orderId;

  useEffect(() => {
    // If no orderId, redirect to home
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }

        setOrder(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get estimated delivery date (3-5 days from order date for regular orders)
  const getEstimatedDelivery = () => {
    if (order?.orderType === 'pre-order' && order.expectedDeliveryDate) {
      return formatDate(order.expectedDeliveryDate);
    }

    const orderDate = new Date(order?.createdAt || '');
    const minDelivery = new Date(orderDate);
    minDelivery.setDate(orderDate.getDate() + 3);

    const maxDelivery = new Date(orderDate);
    maxDelivery.setDate(orderDate.getDate() + 5);

    const minOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const maxOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    return `${minDelivery.toLocaleDateString(undefined, minOptions)} - ${maxDelivery.toLocaleDateString(undefined, maxOptions)}`;
  };

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'paypal':
        return 'PayPal';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold">Loading order details...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-gray-500 mb-8">
                {error || "We couldn't find the order you're looking for."}
              </p>
              <Button asChild size="lg">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We've received your {order.orderType === 'pre-order' ? 'pre-order' : 'order'} and will process it shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order._id.substring(order._id.length - 8)}</h2>
                  <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Delivery Information
                  </h3>
                  <p className="text-sm">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}<br />
                    {order.deliveryAddress.country}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Estimated Delivery:</span> {getEstimatedDelivery()}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <p className="text-sm">
                    <span className="font-medium">Method:</span> {formatPaymentMethod(order.paymentMethod)}<br />
                    <span className="font-medium">Status:</span> {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Order Items */}
              <h3 className="font-medium mb-4 flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Order Items
              </h3>

              <div className="space-y-6">
                {order.shops.map(shop => (
                  <div key={shop.shopId} className="space-y-3">
                    <h4 className="font-medium">{shop.shopName}</h4>

                    <div className="space-y-3">
                      {order.items
                        .filter(item => {
                          // Find items from this shop
                          const shopItems = order.items.filter(i =>
                            order.shops.find(s =>
                              s.shopId === shop.shopId &&
                              i.product.id.startsWith(shop.shopId)
                            )
                          );
                          return shopItems.includes(item);
                        })
                        .map(item => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span>
                              {item.product.name} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))
                      }
                    </div>

                    <div className="flex justify-between text-sm font-medium pt-1">
                      <span>Shop Subtotal</span>
                      <span>{formatCurrency(shop.subtotal)}</span>
                    </div>

                    <Separator />
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>
                    {order.deliveryFee === 0
                      ? 'Free'
                      : formatCurrency(order.deliveryFee)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                Continue Shopping
              </Link>
            </Button>

            <Button asChild>
              <Link to="/orders">
                View All Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
