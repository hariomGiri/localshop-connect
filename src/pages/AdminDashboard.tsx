
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, Users, Store, Package, BarChart, Loader2 } from 'lucide-react';
import { shopAPI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminDashboard = () => {
  // State for dashboard data
  const [pendingShops, setPendingShops] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showShopDetails, setShowShopDetails] = useState(false);

  // State for loading indicators
  const [loading, setLoading] = useState({
    stats: true,
    shops: true,
    users: true
  });

  // State for dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeShops: 0,
    pendingShops: 0,
    totalProducts: 0,
    platformRevenue: 0
  });

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await shopAPI.getAdminStats();
        if (response.success && response.data) {
          setDashboardStats({
            totalUsers: response.data.totalUsers,
            activeShops: response.data.activeShops,
            pendingShops: ('pendingShops' in response.data) ? Number(response.data.pendingShops) : 0,
            totalProducts: response.data.totalProducts,
            platformRevenue: response.data.platformRevenue
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard statistics',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, []);

  // Fetch pending shops
  useEffect(() => {
    const fetchPendingShops = async () => {
      try {
        const response = await shopAPI.getPendingShops();
        if (response.success && response.data) {
          setPendingShops(response.data);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load pending shops',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, shops: false }));
      }
    };

    fetchPendingShops();
  }, []);

  // Fetch recent users
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await shopAPI.getRecentUsers();
        if (response.success && response.data) {
          setRecentUsers(response.data);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load recent users',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    fetchRecentUsers();
  }, []);

  // Handle shop approval/rejection
  const handleShopStatus = async (shopId, status) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('You must be logged in to perform this action');
      }

      const url = status === 'approved'
        ? `http://localhost:5000/api/shops/${shopId}/approve`
        : `http://localhost:5000/api/shops/${shopId}/reject`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          rejectionReason: status === 'rejected' ? 'Does not meet our requirements' : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? `Failed to ${status} shop`);
      }

      // Remove the shop from the pending list
      setPendingShops(pendingShops.filter(shop => shop._id !== shopId));

      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        pendingShops: prev.pendingShops - 1,
        activeShops: status === 'approved' ? prev.activeShops + 1 : prev.activeShops
      }));

      toast({
        title: 'Success',
        description: `Shop ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        variant: 'default'
      });

      // Send email notification to shop owner (this would be handled by the backend)

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${status} shop`,
        variant: 'destructive'
      });
    }
  };

  // View shop details
  const viewShopDetails = (shop) => {
    setSelectedShop(shop);
    setShowShopDetails(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin</p>
          </div>

          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Platform users</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardStats.activeShops.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Approved shops</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Shops</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardStats.pendingShops.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${dashboardStats.platformRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total revenue</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="shop-verification">
            <TabsList className="mb-8">
              <TabsTrigger value="shop-verification">Shop Verification</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="shop-verification" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Shop Approvals</CardTitle>
                  <CardDescription>Review and approve new shop registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.shops ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      <span>Loading pending shops...</span>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                        <div className="col-span-2">Shop Name</div>
                        <div>Owner</div>
                        <div>Category</div>
                        <div>Submitted</div>
                        <div>Actions</div>
                      </div>

                      {pendingShops.map((shop) => (
                        <div key={shop._id} className="grid grid-cols-6 p-3 text-sm border-t items-center">
                          <div className="col-span-2 font-medium">{shop.name}</div>
                          <div>{shop.owner?.name || 'Unknown'}</div>
                          <div>
                            <Badge variant="outline">{shop.category}</Badge>
                          </div>
                          <div className="text-gray-500">
                            {format(new Date(shop.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleShopStatus(shop._id, 'approved')}
                              title="Approve shop"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleShopStatus(shop._id, 'rejected')}
                              title="Reject shop"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => viewShopDetails(shop)}
                              title="View details"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {pendingShops.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                          No pending shop approvals
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Manage users and their accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.users ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      <span>Loading users...</span>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                        <div>User</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Joined</div>
                        <div>Actions</div>
                      </div>

                      {recentUsers.map((user) => (
                        <div key={user._id} className="grid grid-cols-5 p-3 text-sm border-t items-center">
                          <div className="font-medium">{user.name}</div>
                          <div>{user.email}</div>
                          <div>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                          <div className="text-gray-500">
                            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
                      ))}

                      {recentUsers.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                          No recent users found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reporting</CardTitle>
                  <CardDescription>Platform performance and insights</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Analytics charts will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Configure platform preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-8">
                      Platform settings panel will be implemented soon.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Configuration Test</CardTitle>
                    <CardDescription>Send a test email to verify your SMTP configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
                      const email = emailInput?.value;

                      if (!email) {
                        toast({
                          title: "Error",
                          description: "Please enter a valid email address",
                          variant: "destructive"
                        });
                        return;
                      }

                      // Get token from localStorage
                      const token = localStorage.getItem('token');

                      if (!token) {
                        toast({
                          title: "Error",
                          description: "You must be logged in to perform this action",
                          variant: "destructive"
                        });
                        return;
                      }

                      // Set loading state
                      const button = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
                      const originalText = button.innerText;
                      button.disabled = true;
                      button.innerText = 'Sending...';

                      // Send test email
                      fetch('http://localhost:5000/api/admin/test-email', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ email })
                      })
                      .then(response => response.json())
                      .then(data => {
                        if (data.success) {
                          toast({
                            title: "Success",
                            description: "Test email sent successfully. Please check your inbox.",
                            variant: "default"
                          });

                          if (data.data?.previewUrl) {
                            // For Ethereal test emails, open the preview URL
                            window.open(data.data.previewUrl, '_blank');
                          }
                        } else {
                          throw new Error(data.message || 'Failed to send test email');
                        }
                      })
                      .catch(error => {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to send test email",
                          variant: "destructive"
                        });
                      })
                      .finally(() => {
                        // Reset button state
                        button.disabled = false;
                        button.innerText = originalText;
                      });
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="test-email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            id="test-email"
                            placeholder="Enter email address"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          />
                          <Button type="submit">Send Test Email</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This will send a test email to verify your SMTP configuration.
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Shop Details Dialog */}
      <Dialog open={showShopDetails} onOpenChange={setShowShopDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
            <DialogDescription>
              Review detailed information about this shop application
            </DialogDescription>
          </DialogHeader>

          {selectedShop && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Shop Name</h4>
                  <p className="text-base font-medium">{selectedShop.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <Badge variant="outline">{selectedShop.category}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                  <p className="text-base">{selectedShop.owner?.name || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Submitted On</h4>
                  <p className="text-base">{format(new Date(selectedShop.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedShop.description || 'No description provided'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Address</h4>
                <p className="text-sm text-muted-foreground">{selectedShop.address || 'No address provided'}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowShopDetails(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    handleShopStatus(selectedShop._id, 'approved');
                    setShowShopDetails(false);
                  }}
                >
                  Approve Shop
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
