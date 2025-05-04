
import React from 'react';
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
import { ImageUp, DollarSign, Tag, PackageCheck, Truck } from 'lucide-react';

const CreateProduct = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product created",
      description: "Your product has been created successfully",
    });
    // In a real app, we would save the product to the database
    // For now, just navigate back to the dashboard
    navigate('/shopkeeper/dashboard');
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
                  <Input id="name" placeholder="Enter product name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
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
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input id="price" type="number" step="0.01" min="0" className="pl-10" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <div className="relative">
                    <PackageCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input id="stock" type="number" min="0" className="pl-10" required />
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
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <ImageUp className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
                  <p className="text-gray-400 text-sm mb-4">Supported formats: JPG, PNG, WebP (Max 5MB)</p>
                  <Button type="button" variant="outline" size="sm">
                    Select Images
                  </Button>
                </div>
              </div>
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
                    <Checkbox id="delivery" />
                    <Label htmlFor="delivery">Available for delivery</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pickup" defaultChecked />
                    <Label htmlFor="pickup">Available for in-store pickup</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/shopkeeper/dashboard')}>
                Cancel
              </Button>
              <Button type="submit">Create Product</Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateProduct;
