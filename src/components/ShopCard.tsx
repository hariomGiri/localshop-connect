
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Shop {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  category: string;
  distance: string;
  address: string;
  isOpen: boolean;
  products: number;
  tags: string[];
}

interface ShopCardProps {
  shop: Shop;
  featured?: boolean;
}

const ShopCard = ({ shop, featured = false }: ShopCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/shop/${shop.id}`}
      className={cn(
        "block group rounded-xl overflow-hidden transition-all duration-300",
        featured ? "shadow-lg" : "border border-gray-100 shadow-sm hover:shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={
            shop.imageUrl.startsWith('http')
              ? shop.imageUrl
              : `http://localhost:5001/uploads/${shop.imageUrl.replace('uploads/', '')}?nocache=${new Date().getTime()}`
          }
          alt={shop.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-105" : "scale-100"
          )}
          loading="lazy"
          onError={(e) => {
            // If image fails to load, use a fallback image
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>

        {/* Category Badge */}
        <Badge
          className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white/80"
        >
          {shop.category}
        </Badge>

        {/* Open/Closed Status */}
        <Badge
          className={cn(
            "absolute top-4 right-4",
            shop.isOpen
              ? "bg-green-500/90 hover:bg-green-500/80"
              : "bg-gray-500/90 hover:bg-gray-500/80"
          )}
        >
          {shop.isOpen ? "Open Now" : "Closed"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {shop.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" />
            <span className="text-sm font-medium">{shop.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({shop.reviewCount})</span>
          </div>
        </div>

        {/* Address and distance */}
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{shop.address}</span>
          <span className="mx-2">•</span>
          <span>{shop.distance}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3 mb-2">
          {shop.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-secondary/50 text-xs"
            >
              {tag}
            </Badge>
          ))}
          {shop.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs"
            >
              +{shop.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Products count and view detail */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-sm">
            <span className="font-medium">{shop.products}</span>
            <span className="text-muted-foreground ml-1">products</span>
          </div>

          <span className="text-sm text-primary font-medium flex items-center">
            View Shop
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
