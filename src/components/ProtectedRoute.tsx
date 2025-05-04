import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          setIsLoading(false);
          return;
        }
        
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setIsAuthenticated(true);
        
        // Check if user has required role
        if (allowedRoles.length === 0 || allowedRoles.includes(data.user.role)) {
          setHasRequiredRole(true);
        } else {
          setHasRequiredRole(false);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive"
          });
        }
        
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [allowedRoles, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Verifying your access...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!hasRequiredRole) {
    // Redirect based on user role
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (user.role === 'shopkeeper') {
        return <Navigate to="/shopkeeper/dashboard" replace />;
      }
    }
    
    // Default redirect to home
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
