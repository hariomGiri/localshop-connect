import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  subtotal: number;
}

interface OrderShop {
  shopId: string;
  shopName: string;
  subtotal: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shops: OrderShop[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  orderType: 'regular' | 'pre-order';
  expectedDeliveryDate?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const Orders = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view your orders",
            variant: "destructive"
          });
          return;
        }

        const response = await fetch('http://localhost:5001/api/orders/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load orders",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'processing', 'shipped'].includes(order.orderStatus);
    if (activeTab === 'completed') return order.orderStatus === 'delivered';
    if (activeTab === 'cancelled') return order.orderStatus === 'cancelled';
    if (activeTab === 'pre-orders') return order.orderType === 'pre-order';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold">Loading your orders...</h2>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="pre-orders">Pre-Orders</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {activeTab === 'all'
                  ? "You haven't placed any orders yet. Browse our shops to find products you'll love."
                  : `You don't have any ${activeTab.replace('-', ' ')} at the moment.`
                }
              </p>
              <Button asChild size="lg">
                <Link to="/shops">Browse Shops</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <Card key={order._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Order #{order._id.substring(order._id.length - 8)}</h3>
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </Badge>
                          {order.orderType === 'pre-order' && (
                            <Badge variant="outline">Pre-Order</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(order.total)}</div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </div>

                        <Button asChild variant="outline" size="sm">
                          <Link to={`/order-confirmation`} state={{ orderId: order._id }}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {getStatusIcon(order.orderStatus)}
                        <span className="font-medium">
                          {order.orderStatus === 'pending' && 'Order received, waiting for processing'}
                          {order.orderStatus === 'processing' && 'Order is being processed'}
                          {order.orderStatus === 'shipped' && 'Order has been shipped'}
                          {order.orderStatus === 'delivered' && 'Order has been delivered'}
                          {order.orderStatus === 'cancelled' && 'Order has been cancelled'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.shops.map(shop => (
                          <div key={shop.shopId} className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">{shop.shopName}</h4>
                            <ul className="text-sm space-y-1">
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
                                .slice(0, 3)
                                .map(item => (
                                  <li key={item.product.id} className="truncate">
                                    {item.quantity}× {item.product.name}
                                  </li>
                                ))
                              }

                              {order.items.filter(item => {
                                // Count items from this shop
                                const shopItems = order.items.filter(i =>
                                  order.shops.find(s =>
                                    s.shopId === shop.shopId &&
                                    i.product.id.startsWith(shop.shopId)
                                  )
                                );
                                return shopItems.includes(item);
                              }).length > 3 && (
                                <li className="text-gray-500">
                                  + {order.items.filter(item => {
                                    // Count items from this shop
                                    const shopItems = order.items.filter(i =>
                                      order.shops.find(s =>
                                        s.shopId === shop.shopId &&
                                        i.product.id.startsWith(shop.shopId)
                                      )
                                    );
                                    return shopItems.includes(item);
                                  }).length - 3} more items
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
