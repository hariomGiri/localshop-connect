import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';

interface CartDropdownProps {
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ onClose }) => {
  const { cart, removeItem, updateQuantity } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Group items by shop
  const itemsByShop = cart.items.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = {
        shopId: item.shopId,
        shopName: item.shopName,
        items: []
      };
    }
    acc[item.shopId].items.push(item);
    return acc;
  }, {} as Record<string, { shopId: string; shopName: string; items: typeof cart.items }>);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Your Cart</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {cart.items.length === 0 ? (
        <div className="p-6 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button asChild variant="outline" onClick={onClose}>
            <Link to="/shops">Browse Shops</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto p-4 space-y-6">
            {Object.values(itemsByShop).map(shop => (
              <div key={shop.shopId} className="space-y-3">
                <div className="font-medium text-sm text-gray-500">
                  {shop.shopName}
                </div>

                {shop.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.imageUrl.startsWith('http')
                            ? item.imageUrl
                            : `http://localhost:5001/uploads/${item.imageUrl.replace('uploads/', '')}?nocache=${new Date().getTime()}`
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, use a fallback image
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-primary font-medium">
                          {formatCurrency(item.price)}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="text-sm w-4 text-center">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">{formatCurrency(cart.total)}</span>
            </div>

            <Button asChild className="w-full">
              <Link to="/cart" onClick={onClose}>View Cart & Checkout</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
