import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import CartDropdown from './CartDropdown';

const CartIcon: React.FC = () => {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const closeDropdown = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={toggleDropdown}
        aria-label={`Shopping cart with ${cart.itemCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.itemCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-primary text-white"
          >
            {cart.itemCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <CartDropdown onClose={closeDropdown} />
      )}
    </div>
  );
};

export default CartIcon;
