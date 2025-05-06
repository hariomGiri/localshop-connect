import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Upload } from 'lucide-react';

// Shop categories - must match the backend enum values
const shopCategories = [
  'grocery',
  'electronics',
  'fashion',
  'books',
  'bakery',
  'homegoods',
  'other'
];

const ShopProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shop, setShop] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });

  // Fetch shop data
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
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
        const response = await fetch('http://localhost:5001/api/shops/user/myshop', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            // No shop found, redirect to create shop page
            navigate('/create-shop');
            return;
          }
          throw new Error(data.message || 'Failed to fetch shop data');
        }

        setShop(data.data);

        // Initialize form data
        // Ensure the category is one of the valid options
        const shopCategory = data.data.category || '';
        const isValidCategory = shopCategories.includes(shopCategory.toLowerCase());

        setFormData({
          name: data.data.name || '',
          description: data.data.description || '',
          category: isValidCategory ? shopCategory.toLowerCase() : '',
          street: data.data.address?.street || '',
          city: data.data.address?.city || '',
          state: data.data.address?.state || '',
          zipCode: data.data.address?.zipCode || '',
          phone: data.data.contact?.phone || '',
          email: data.data.contact?.email || ''
        });

        // Set image preview if available
        if (data.data.imageUrl) {
          // Add timestamp to prevent caching
          const timestamp = new Date().getTime();
          const imageUrl = data.data.imageUrl.replace('uploads/', '');
          setImagePreview(`http://localhost:5001/uploads/${imageUrl}?t=${timestamp}`);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load shop data',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [navigate, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('You must be logged in to update your shop');
      }

      // Validate category
      if (!formData.category) {
        throw new Error('Please select a shop category');
      }

      // Create FormData for file upload
      const shopFormData = new FormData();

      // Add shop details
      shopFormData.append('name', formData.name);
      shopFormData.append('description', formData.description);
      shopFormData.append('category', formData.category.toLowerCase()); // Ensure lowercase

      // Create address and contact objects
      const addressData = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      const contactData = {
        phone: formData.phone,
        email: formData.email
      };

      // Add address and contact as JSON strings
      shopFormData.append('address', JSON.stringify(addressData));
      shopFormData.append('contact', JSON.stringify(contactData));

      // Add image if selected
      if (imageFile) {
        shopFormData.append('shopImage', imageFile);
      }

      // Log the form data for debugging
      console.log('Submitting shop data:', {
        name: formData.name,
        description: formData.description,
        category: formData.category.toLowerCase(),
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        contact: {
          phone: formData.phone,
          email: formData.email
        }
      });

      // Log the form data for debugging (excluding the file)
      console.log('FormData entries:');
      for (const [key, value] of shopFormData.entries()) {
        if (key !== 'shopImage') {
          console.log(`${key}: ${value}`);
        } else {
          console.log(`${key}: [File]`);
        }
      }

      // Update shop using the API function
      const response = await fetch(`http://localhost:5001/api/shops/${shop._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: shopFormData
      });

      const data = await response.json();

      // Force reload the page after successful update to refresh all shop data
      if (response.ok && imageFile) {
        // Add a small delay to ensure the server has processed the image
        toast({
          title: "Image Uploaded",
          description: "Your shop image has been updated. Refreshing page to show changes...",
        });

        // Clear browser cache for the image and reload
        setTimeout(() => {
          // Force a hard reload to clear cache
          window.location.href = window.location.href.split('#')[0] + '?t=' + new Date().getTime();
        }, 1500);
      }

      if (!response.ok) {
        console.error('Server response error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });

        // Handle validation errors
        if (response.status === 400 && data.message) {
          // Extract validation error message
          const errorMessage = data.message;
          throw new Error(errorMessage);
        }
        throw new Error(data.message ?? 'Failed to update shop');
      }

      toast({
        title: "Shop Updated",
        description: "Your shop details have been updated successfully.",
      });

      // Update shop state with new data
      setShop(data.data);
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update shop',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16 pb-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Shop Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your shop details and appearance
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg font-medium">Loading shop details...</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>
                  Update your shop details to help customers find and connect with your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shop Image */}
                  <div className="space-y-2">
                    <Label>Shop Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Shop preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <Input
                          type="file"
                          id="shopImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="max-w-xs"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: 500x500px JPG or PNG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Shop Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category">
                            {formData.category && (
                              formData.category.charAt(0).toUpperCase() + formData.category.slice(1)
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {shopCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell customers about your shop, products, and services"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopProfile;
