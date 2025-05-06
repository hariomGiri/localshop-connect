
import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Store, User, FileText, ArrowLeft, Upload, MapPin, CreditCard } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') || 'customer';
  const [activeTab, setActiveTab] = useState(defaultType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopCategory: 'grocery',
    address: '',
    phone: '',
    idProof: null as File | null,
    businessDocument: null as File | null,
    location: { lat: 0, lng: 0, address: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'idProof' | 'businessDocument') => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [fieldName]: e.target.files[0] });
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData({ ...formData, location, address: location.address });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error messages

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // For shopkeeper registration, check if email already exists before proceeding
    if (activeTab === 'shop' && currentStep === 3) {
      try {
        // Check if email already exists
        const checkResponse = await fetch('http://localhost:5001/api/auth/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        }).catch(() => null);

        if (checkResponse && checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (checkData.exists) {
            setErrorMessage('This email is already registered. Please use a different email or try logging in.');
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        // If the check fails, we'll proceed with registration and let the server handle any duplicates
        console.log('Email check failed, proceeding with registration');
      }
    }

    try {
      if (activeTab === 'customer') {
        // Register as a customer
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'customer'
        };

        const response = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 400 && data.message?.includes('already exists')) {
            setErrorMessage('This email is already registered. Please use a different email or try logging in.');
          } else {
            setErrorMessage(data.message ?? 'Registration failed. Please try again.');
          }
          return;
        }

        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        toast({
          title: "Registration successful!",
          description: "Your account has been created. Welcome to ShowcaseConnect!",
        });

        navigate('/dashboard');
      } else if (activeTab === 'shop' && currentStep === 3) {
        // Register user with pending_shopkeeper role first
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'pending_shopkeeper'
        };

        const userResponse = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const userResponseData = await userResponse.json();

        if (!userResponse.ok) {
          // Handle specific error cases
          if (userResponse.status === 400 && userResponseData.message?.includes('already exists')) {
            setErrorMessage('This email is already registered. Please use a different email or try logging in.');
          } else {
            setErrorMessage(userResponseData.message ?? 'User registration failed. Please try again.');
          }
          return;
        }

        // Store token in localStorage
        if (userResponseData.token) {
          localStorage.setItem('token', userResponseData.token);
          localStorage.setItem('user', JSON.stringify(userResponseData.user));

          // Now register the shop with the token
          const shopData = new FormData();
          shopData.append('name', formData.shopName);
          shopData.append('category', formData.shopCategory);
          shopData.append('description', `${formData.shopName} - A new shop on ShowcaseConnect`);
          shopData.append('address', formData.address);
          // Parse address components more reliably
          const addressParts = formData.location.address.split(',').map(part => part.trim());

          // Default values in case parsing fails
          let city = 'Unknown City';
          let state = 'Unknown State';
          let zipCode = '00000';

          // Try to extract city, state, and zip from address parts
          if (addressParts.length >= 2) {
            city = addressParts[1] || city;
          }

          if (addressParts.length >= 3) {
            state = addressParts[2] || state;
          }

          // The last part might contain the zip code
          if (addressParts.length >= 4) {
            zipCode = addressParts[3] || zipCode;
          }

          shopData.append('city', city);
          shopData.append('state', state);
          shopData.append('zipCode', zipCode);
          shopData.append('email', formData.email);
          shopData.append('phone', formData.phone);
          shopData.append('latitude', formData.location.lat.toString());
          shopData.append('longitude', formData.location.lng.toString());

          // Add documents if they exist
          if (formData.idProof) {
            shopData.append('idProof', formData.idProof);
          }

          if (formData.businessDocument) {
            shopData.append('businessDocument', formData.businessDocument);
          }

          try {
            console.log('Submitting shop data with fields:',
              Array.from(shopData.entries()).map(([key, value]) => `${key}: ${value}`).join(', '));

            const shopResponse = await fetch('http://localhost:5001/api/shops/register', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${userResponseData.token}`,
              },
              body: shopData,
            });

            const shopResponseData = await shopResponse.json();

            if (!shopResponse.ok) {
              console.error('Shop registration failed:', shopResponseData);

              // Check for specific missing fields
              if (shopResponseData.message?.includes('required fields')) {
                setErrorMessage('Please ensure all required fields are filled in: shop name, category, address, city, state, ZIP code, email, and phone.');
              } else {
                setErrorMessage(shopResponseData.message ?? 'Shop registration failed. Please try again.');
              }
              return;
            }

            toast({
              title: "Registration submitted!",
              description: "Your shop application has been submitted. We'll review your details and notify you once approved.",
            });

            // Navigate to a pending approval page instead of shopkeeper dashboard
            navigate('/pending-approval');
          } catch (shopError) {
            setErrorMessage('Failed to register shop. Please try again later.');
          }
        }
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');

      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="ShowcaseConnect Logo"
              className="h-10 w-auto"
            />
          </Link>

          <Link to="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display">Create Your Account</h1>
            <p className="mt-2 text-gray-600">
              Join the community and connect with local shops and customers.
            </p>
          </div>

          <Tabs
            defaultValue={defaultType}
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="customer" className="text-base flex items-center gap-2 py-3">
                <User className="h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="shop" className="text-base flex items-center gap-2 py-3">
                <Store className="h-4 w-4" />
                Shop Owner
              </TabsTrigger>
            </TabsList>

            <div className="bg-white shadow-sm rounded-xl border p-6 sm:p-8">
              <TabsContent value="customer">
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>

                  <h2 className="text-xl font-semibold text-center">Customer Registration</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
                    Create a customer account to discover and shop from local businesses in your area.
                  </p>

                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className={errorMessage?.includes('email') ? "border-red-300 focus-visible:ring-red-400" : ""}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          className={errorMessage?.includes('password') ? "border-red-300 focus-visible:ring-red-400" : ""}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className={errorMessage?.includes('password') ? "border-red-300 focus-visible:ring-red-400" : ""}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="shop">
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <Store className="h-6 w-6 text-primary" />
                  </div>

                  <h2 className="text-xl font-semibold text-center">Shop Registration</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
                    Create your shop profile to showcase your products and connect with local customers.
                  </p>

                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {/* Shop Registration Form with Steps */}
                  <div className="mt-8">
                    <div className="mb-8">
                      <div className="relative">
                        <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                          <div
                            className="shadow-none flex flex-col whitespace-nowrap justify-center bg-primary transition-all"
                            style={{ width: `${(currentStep / 3) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <div className={`text-xs font-semibold ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>
                            Basic Information
                          </div>
                          <div className={`text-xs font-semibold ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>
                            Shop Location
                          </div>
                          <div className={`text-xs font-semibold ${currentStep >= 3 ? 'text-primary' : 'text-gray-500'}`}>
                            Verification
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="shopName">Shop Name</Label>
                            <Input
                              id="shopName"
                              name="shopName"
                              value={formData.shopName}
                              onChange={handleChange}
                              placeholder="Enter your shop name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shopCategory">Shop Category</Label>
                            <RadioGroup
                              defaultValue="grocery"
                              className="grid grid-cols-2 gap-2 pt-2"
                              onValueChange={(value) => setFormData({...formData, shopCategory: value})}
                            >
                              {[
                                { value: 'grocery', label: 'Grocery' },
                                { value: 'electronics', label: 'Electronics' },
                                { value: 'fashion', label: 'Fashion' },
                                { value: 'homegoods', label: 'Home & Garden' },
                                { value: 'bakery', label: 'Bakery' },
                                { value: 'books', label: 'Books' }
                              ].map((category) => (
                                <div key={category.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={category.value} id={category.value} />
                                  <Label htmlFor={category.value}>{category.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Business Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Enter your business phone"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="name">Owner's Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email address"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm Password</Label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                              />
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button
                              type="button"
                              className="w-full"
                              onClick={nextStep}
                            >
                              Continue to Shop Location
                            </Button>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              <Label htmlFor="location" className="text-lg font-medium">Shop Location</Label>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Pin your shop's location on the map or enter the address manually below.
                            </p>

                            <div className="space-y-1 mb-4">
                              <Label htmlFor="address">Shop Address</Label>
                              <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your shop address"
                                required
                              />
                            </div>

                            <div className="h-80 border border-gray-200 rounded-md overflow-hidden mb-4">
                              <LocationPicker onLocationSelect={handleLocationSelect} />
                            </div>

                            <p className="text-xs text-muted-foreground mt-1">
                              Click on the map to pinpoint your exact shop location.
                            </p>
                          </div>

                          <div className="flex justify-between gap-4 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={prevStep}
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              className="flex-1"
                              onClick={nextStep}
                            >
                              Continue to Verification
                            </Button>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <CreditCard className="h-5 w-5 text-primary" />
                              <Label className="text-lg font-medium">Business Verification</Label>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Please upload your business documents and ID proof for verification.
                              This helps us ensure the authenticity of businesses on our platform.
                            </p>

                            <div className="space-y-4">
                              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <div className="space-y-2">
                                  <div className="flex justify-center">
                                    <FileText className="h-10 w-10 text-gray-400" />
                                  </div>
                                  <Label htmlFor="businessDocument" className="block text-sm font-medium">
                                    Business Registration Document
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    Upload your business license or registration certificate (PDF or image)
                                  </p>
                                  <div className="mt-2">
                                    <Input
                                      id="businessDocument"
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleFileChange(e, 'businessDocument')}
                                      accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => document.getElementById('businessDocument')?.click()}
                                      className="w-full flex items-center justify-center gap-2"
                                    >
                                      <Upload className="h-4 w-4" />
                                      {formData.businessDocument ? formData.businessDocument.name : 'Browse Files'}
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <div className="space-y-2">
                                  <div className="flex justify-center">
                                    <User className="h-10 w-10 text-gray-400" />
                                  </div>
                                  <Label htmlFor="idProof" className="block text-sm font-medium">
                                    ID Proof
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    Upload a government-issued ID (driver's license, passport)
                                  </p>
                                  <div className="mt-2">
                                    <Input
                                      id="idProof"
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleFileChange(e, 'idProof')}
                                      accept=".jpg,.jpeg,.png,.pdf"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => document.getElementById('idProof')?.click()}
                                      className="w-full flex items-center justify-center gap-2"
                                    >
                                      <Upload className="h-4 w-4" />
                                      {formData.idProof ? formData.idProof.name : 'Browse Files'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between gap-4 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={prevStep}
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Registering Shop...' : 'Register Your Shop'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
