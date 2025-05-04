
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, LogOut, Settings, Store, Package, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import CartIcon from '@/components/CartIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage events (for when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });

    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    closeMenu();
    setIsSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
    { name: 'Products', path: '/products' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8',
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          aria-label="ShowcaseConnect"
        >
          <ShoppingBag
            className="h-8 w-8 text-primary"
            aria-hidden="true"
          />
          <span className="font-bold text-xl md:text-2xl font-display">
            Showcase<span className="text-primary">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-base font-medium hover:text-primary transition-colors',
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-foreground/80'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-64 pr-10"
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <CartIcon />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  aria-label="User menu"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name?.split(' ')[0] || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="flex items-center gap-2 w-full cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                {user.role === 'shopkeeper' && (
                  <DropdownMenuItem asChild>
                    <Link to="/shopkeeper/dashboard" className="flex items-center gap-2 w-full cursor-pointer">
                      <Store className="h-4 w-4" />
                      Shop Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 w-full cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 w-full cursor-pointer">
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 w-full cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                aria-label="Login or Create Account"
              >
                <User className="h-4 w-4" />
                <span>Account</span>
              </Button>
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/register?type=shop">
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                aria-label="Register your shop"
              >
                Register Shop
              </Button>
            </Link>
          ) : user?.role === 'shopkeeper' ? (
            <Link to="/shopkeeper/create-product">
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                aria-label="Add new product"
              >
                Add Product
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 flex flex-col bg-white z-40 px-6 pt-20 pb-6 md:hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="flex flex-col space-y-6 mt-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-lg font-medium py-2 border-b border-gray-100',
                isActive(link.path) ? 'text-primary' : 'text-foreground'
              )}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-4">
            <span className="text-sm font-medium">Your Cart</span>
            <CartIcon />
          </div>

          {isAuthenticated && user ? (
            <>
              {/* User info */}
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-xs text-primary mt-1 capitalize">{user.role}</div>
              </div>

              {/* User actions */}
              <div className="space-y-3">
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-center text-left flex items-center gap-2"
                      onClick={closeMenu}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                {user.role === 'shopkeeper' && (
                  <>
                    <Link to="/shopkeeper/dashboard" className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-center text-left flex items-center gap-2"
                        onClick={closeMenu}
                      >
                        <Store className="h-4 w-4" />
                        Shop Dashboard
                      </Button>
                    </Link>

                    <Link to="/shopkeeper/create-product" className="block w-full">
                      <Button
                        className="w-full justify-center bg-primary text-white flex items-center gap-2"
                        onClick={closeMenu}
                      >
                        <Package className="h-4 w-4" />
                        Add Product
                      </Button>
                    </Link>
                  </>
                )}

                <Button
                  variant="destructive"
                  className="w-full justify-center flex items-center gap-2"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={closeMenu}
                >
                  Login
                </Button>
              </Link>

              <Link to="/register?type=shop" className="block w-full">
                <Button
                  className="w-full justify-center bg-primary text-white"
                  onClick={closeMenu}
                >
                  Register Shop
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
