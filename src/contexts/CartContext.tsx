import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types for cart items and context
export interface CartItem {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_SHOP_ITEMS'; payload: string };

interface CartContextType {
  cart: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearShopItems: (shopId: string) => void;
  isInCart: (id: string) => boolean;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial state
const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
};

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : initialState;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return initialState;
  }
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        newState = {
          ...state,
          items: updatedItems,
        };
      } else {
        // New item, add to cart
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        newState = {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      } else {
        // Update quantity
        newState = {
          ...state,
          items: state.items.map(item => 
            item.id === id ? { ...item, quantity } : item
          ),
        };
      }
      break;
    }
    
    case 'CLEAR_CART': {
      newState = initialState;
      break;
    }
    
    case 'CLEAR_SHOP_ITEMS': {
      newState = {
        ...state,
        items: state.items.filter(item => item.shopId !== action.payload),
      };
      break;
    }
    
    default:
      return state;
  }
  
  // Calculate totals
  const itemCount = newState.items.reduce((count, item) => count + item.quantity, 0);
  const total = newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    ...newState,
    itemCount,
    total,
  };
};

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Cart actions
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const clearShopItems = (shopId: string) => {
    dispatch({ type: 'CLEAR_SHOP_ITEMS', payload: shopId });
  };
  
  const isInCart = (id: string) => {
    return cart.items.some(item => item.id === id);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      clearShopItems,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
