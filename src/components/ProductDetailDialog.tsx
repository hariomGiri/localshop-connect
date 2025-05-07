import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Check, ShoppingCart, Star, Store, Tag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { getProductFallbackImage } from '@/utils/imageUtils';
import { Product } from './ProductCard';

interface ProductDetailDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, isOpen, onClose }: ProductDetailDialogProps) => {
  const [isPrebooking, setPrebooking] = React.useState(false);
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      shopId: product.shopId,
      shopName: product.shop,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handlePrebook = () => {
    setPrebooking(true);
    setTimeout(() => {
      setPrebooking(false);
      // Add to cart with a note that it's a pre-order
      addItem({
        id: product.id,
        shopId: product.shopId,
        shopName: product.shop,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category
      });

      toast({
        title: "Pre-ordered successfully",
        description: `${product.name} has been pre-ordered. We'll notify you when it's available.`,
      });
    }, 1000);
  };

  // Helper function to render button text
  const getButtonText = () => {
    if (!product.inStock) {
      return 'Pre-order';
    }

    // Use optional chaining to safely call isInCart
    if (isInCart?.(product.id)) {
      return (
        <span className="flex items-center justify-center">
          <Check className="h-4 w-4 mr-2" />
          Added to Cart
        </span>
      );
    }

    return (
      <span className="flex items-center justify-center">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {product.category}
            </Badge>
            {product.rating && (
              <span className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                {product.rating}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Product Image */}
          <div className="aspect-square rounded-md overflow-hidden relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, use a category-specific fallback image
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = getProductFallbackImage(product.category);
              }}
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="px-4 py-2 bg-white/90 rounded-md text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Price</h3>
                <p className="text-2xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-1">Availability</h3>
                <Badge variant={product.inStock ? "default" : "outline"} className={product.inStock ? "bg-green-500" : "bg-red-100 text-red-800"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sold by: </span>
              <span className="text-sm text-primary">{product.shop}</span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!product.inStock && isPrebooking}
            onClick={product.inStock ? handleAddToCart : handlePrebook}
          >
            {isPrebooking ? 'Processing...' : getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
