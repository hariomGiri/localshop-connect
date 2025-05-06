import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, ShoppingBag } from 'lucide-react';

const PendingApproval = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // If user is already a shopkeeper (approved), redirect to dashboard
        if (parsedUser.role === 'shopkeeper') {
          navigate('/shopkeeper/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl font-display">
              Showcase<span className="text-primary">Connect</span>
            </span>
          </Link>

          <Link to="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl font-display">Shop Application Pending</CardTitle>
              <CardDescription className="text-base mt-2">
                Your shop registration is currently under review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800">Verification in Progress</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Our team is reviewing your shop details and documents. This process typically takes 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">What happens next?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      We'll review your shop details and verify your business documents
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      You'll receive an email notification once your shop is approved
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      After approval, you can log in and start adding products to your shop
                    </p>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/">Browse Shops</Link>
                </Button>
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PendingApproval;
