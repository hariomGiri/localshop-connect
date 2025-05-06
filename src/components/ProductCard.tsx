import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { getProductFallbackImage } from '@/utils/imageUtils';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  shop: string;
  shopId: string;
  category: string;
  inStock: boolean;
  rating?: number;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const [isPrebooking, setPrebooking] = useState(false);
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
          {compact ? 'Added' : 'Added to Cart'}
        </span>
      );
    }

    return 'Add to Cart';
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-all">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // If image fails to load, use a category-specific fallback image
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = getProductFallbackImage(product.category);
          }}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-white/90 rounded-md text-sm font-medium">Out of Stock</span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
          {product.category}
        </Badge>
      </div>
      <CardContent className="py-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <span className="font-bold text-primary">₹{product.price.toFixed(2)}</span>
        </div>
        {!compact && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">{product.shop}</span>
          {Boolean(product.rating) && (
            <span className="flex items-center text-sm">
              ★ {product.rating}
            </span>
          )}
        </div>
        {Boolean(product.tags?.length) && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {product.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 px-6 pb-6">
        <Button
          className="w-full"
          disabled={!product.inStock && isPrebooking}
          onClick={product.inStock ? handleAddToCart : handlePrebook}
        >
          {isPrebooking ? 'Processing...' : getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
