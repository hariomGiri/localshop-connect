import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, TrendingUp, Clock, Plus, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const ShopkeeperDashboard = () => {
  const navigate = useNavigate();

  // State for shop and product data
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);

  // Mock data for shopkeeper dashboard (orders will be implemented later)
  const recentOrders = [
    { id: '1', customer: 'John Smith', items: 3, total: '₹4,597', status: 'pending', date: '2023-05-17' },
    { id: '2', customer: 'Emily Johnson', items: 1, total: '₹2,499', status: 'completed', date: '2023-05-16' },
    { id: '3', customer: 'Michael Brown', items: 2, total: '₹3,450', status: 'completed', date: '2023-05-15' },
  ];

  // Fetch shop and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view this page",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Fetch shop data
        const shopResponse = await fetch('http://localhost:5001/api/shops/user/myshop', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const shopData = await shopResponse.json();

        if (!shopResponse.ok) {
          if (shopResponse.status === 404) {
            // No shop found, redirect to create shop page
            navigate('/create-shop');
            return;
          }
          throw new Error(shopData.message ?? 'Failed to fetch shop data');
        }

        setShop(shopData.data);

        // Only fetch products if shop is approved
        if (shopData.data.status === 'approved') {
          // Fetch products data
          const productsResponse = await fetch('http://localhost:5001/api/products/my/products', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const productsData = await productsResponse.json();

          if (productsResponse.ok) {
            setProducts(productsData.data || []);
            setProductCount(productsData.count || 0);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load shop data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading your shop dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render shop status banner if shop is not approved
  const renderShopStatusBanner = () => {
    if (!shop) return null;

    if (shop.status === 'pending') {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <h3 className="font-medium text-yellow-800">Shop Pending Approval</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your shop is currently under review. You'll be notified once it's approved.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (shop.status === 'rejected') {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="font-medium text-red-800">Shop Registration Rejected</h3>
              <p className="text-sm text-red-700 mt-1">
                {shop.rejectionReason || 'Your shop registration was rejected. Please update your details and resubmit.'}
              </p>
              <Button variant="outline" className="mt-2" asChild>
                <Link to="/create-shop">Update Shop Details</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (shop.status === 'approved') {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <h3 className="font-medium text-green-800">Shop Approved</h3>
              <p className="text-sm text-green-700 mt-1">
                Your shop is active and visible to customers.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Shopkeeper Dashboard</h1>
              <p className="text-gray-500">{shop?.name || 'Your Shop'}</p>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-4">
              {shop?.status === 'approved' && (
                <Button asChild>
                  <Link to="/shopkeeper/create-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Shop Status Banner */}
          {renderShopStatusBanner()}

          {shop?.status === 'approved' ? (
            <>
              {/* Dashboard Summary Cards - Only show for approved shops */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{productCount}</div>
                    <p className="text-xs text-muted-foreground">{productCount > 0 ? 'Products in your inventory' : 'No products yet'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹28,450</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">145</div>
                    <p className="text-xs text-muted-foreground">+8% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Updated just now</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs - Only show for approved shops */}
              <Tabs defaultValue="overview">
                <TabsList className="mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                          <div>Order ID</div>
                          <div>Customer</div>
                          <div>Items</div>
                          <div>Total</div>
                          <div>Status</div>
                          <div>Date</div>
                        </div>

                        {recentOrders.map((order) => (
                          <div key={order.id} className="grid grid-cols-6 p-3 text-sm border-t items-center">
                            <div className="font-medium">#{order.id}</div>
                            <div>{order.customer}</div>
                            <div>{order.items}</div>
                            <div>{order.total}</div>
                            <div>
                              <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="text-gray-500">{order.date}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Products</CardTitle>
                      <CardDescription>Best-selling items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                          <div>Product Name</div>
                          <div>Stock</div>
                          <div>Price</div>
                          <div>Sales</div>
                          <div>Actions</div>
                        </div>

                        {products.length > 0 ? (
                          products.map((product) => (
                            <div key={product._id} className="grid grid-cols-5 p-3 text-sm border-t items-center">
                              <div className="font-medium">{product.name}</div>
                              <div>
                                {product.stock < 20 ? (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                    Low: {product.stock}
                                  </Badge>
                                ) : (
                                  product.stock
                                )}
                              </div>
                              <div>₹{product.price.toFixed(2)}</div>
                              <div>{product.sales || 0}</div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/shopkeeper/edit-product/${product._id}`)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-muted-foreground">
                            No products found. Click "Add Product" to create your first product.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Orders</CardTitle>
                      <CardDescription>View and manage all customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-8">
                        Full order management interface will be available here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Product Management</CardTitle>
                        <CardDescription>View and manage your products</CardDescription>
                      </div>
                      <Button asChild>
                        <Link to="/shopkeeper/create-product">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-8">
                        Full product management interface will be available here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shop Settings</CardTitle>
                      <CardDescription>Manage your shop details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-8">
                        Shop settings and profile management will be available here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shop Dashboard</CardTitle>
                <CardDescription>
                  {shop?.status === 'pending'
                    ? 'Your shop is pending approval. Once approved, you can manage your products and orders here.'
                    : 'Please update your shop details to continue.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  {shop?.status === 'pending' ? (
                    <div className="text-center">
                      <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Waiting for Approval</h3>
                      <p className="text-muted-foreground max-w-md">
                        Our team is reviewing your shop application. You'll receive an email once your shop is approved.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Shop Registration Rejected</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        {shop?.rejectionReason || 'Your shop registration was rejected. Please update your details and resubmit.'}
                      </p>
                      <Button asChild>
                        <Link to="/create-shop">Update Shop Details</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopkeeperDashboard;
