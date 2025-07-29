import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Wifi, Car, Users, Phone } from "lucide-react";
import { useState } from "react";

interface HostelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  roomsAvailable: number;
  distance: string;
  isFavorited?: boolean;
}

export const HostelCard = ({
  name,
  location,
  price,
  rating,
  reviews,
  images,
  amenities,
  roomsAvailable,
  distance,
  isFavorited = false
}: HostelCardProps) => {
  const [favorited, setFavorited] = useState(isFavorited);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-3 w-3" />;
      case 'parking': return <Car className="h-3 w-3" />;
      case 'common room': return <Users className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-primary transition-all duration-300 border-border">
      {/* Image Section */}
      <div className="relative">
        <img 
          src={images[0] || "/placeholder.svg"} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className={`absolute top-3 right-3 rounded-full ${favorited ? 'text-red-500' : 'text-white'} hover:bg-white/20`}
          onClick={() => setFavorited(!favorited)}
        >
          <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
        </Button>
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-secondary text-secondary-foreground"
        >
          {roomsAvailable} rooms available
        </Badge>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">{name}</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">₵{price}</div>
              <div className="text-xs text-muted-foreground">per semester</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">{location}</span>
            <span className="mx-2">•</span>
            <span>{distance}</span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-secondary fill-current" />
            <span className="ml-1 font-medium text-sm">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-3">
          {amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center text-xs text-muted-foreground">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
          {amenities.length > 3 && (
            <span className="text-xs text-muted-foreground">+{amenities.length - 3} more</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <Phone className="h-3 w-3 mr-2" />
            Contact
          </Button>
          <Button 
            className="flex-1 bg-gradient-primary hover:opacity-90"
            size="sm"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};