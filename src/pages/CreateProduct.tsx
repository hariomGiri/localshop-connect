
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { ImageUp, Tag, PackageCheck } from 'lucide-react';
import { forceReloadAllImages } from '@/utils/cacheBuster';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    isAvailableForDelivery: true,
    isAvailableForPickup: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('You must be logged in to create a product');
      }

      // Create FormData for file upload
      const productFormData = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'shop') {
          if (key === 'price' || key === 'stock') {
            // Convert price and stock to numbers
            const numValue = key === 'price' ? parseFloat(value as string) : parseInt(value as string);
            productFormData.append(key, numValue.toString());
          } else {
            productFormData.append(key, value.toString());
          }
        }
      });

      // Add image if selected
      if (selectedImage) {
        productFormData.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: productFormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to create product');
      }

      toast({
        title: "Product created",
        description: "Your product has been created successfully",
      });

      // Force reload all images to ensure new product images are displayed correctly
      forceReloadAllImages();

      // Navigate to dashboard after a short delay to allow image cache clearing
      setTimeout(() => {
        navigate('/shopkeeper/dashboard');
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create product',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing for your shop</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    required
                    value={formData.category}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pricing & Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <div className="relative">
                    <PackageCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      className="pl-10"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU/Barcode (Optional)</Label>
                  <Input id="sku" placeholder="Product SKU or barcode" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="track-inventory" />
                <Label htmlFor="track-inventory">Track inventory for this product</Label>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Images</h2>

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="w-full max-w-md mx-auto aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center">
                    <ImageUp className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">Drag and drop an image or click to upload</p>
                    <p className="text-gray-400 text-sm mb-4">Supported formats: JPG, PNG, WebP (Max 5MB)</p>
                    <div>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Details</h2>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma separated)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input id="tags" className="pl-10" placeholder="organic, local, fresh" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shipping & Delivery</Label>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAvailableForDelivery"
                      checked={formData.isAvailableForDelivery}
                      onCheckedChange={(checked) => handleCheckboxChange('isAvailableForDelivery', checked as boolean)}
                    />
                    <Label htmlFor="isAvailableForDelivery">Available for delivery</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAvailableForPickup"
                      checked={formData.isAvailableForPickup}
                      onCheckedChange={(checked) => handleCheckboxChange('isAvailableForPickup', checked as boolean)}
                    />
                    <Label htmlFor="isAvailableForPickup">Available for in-store pickup</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/shopkeeper/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProduct;
