import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Wifi, Car, Users, Phone } from "lucide-react";
import { useState } from "react";
import { HostelDetailDialog } from "@/components/ui/hostel-detail-dialog";
import campusViewExterior from "@/assets/campus-view-exterior.jpg";
import studentLodgeExterior from "@/assets/student-lodge-exterior.jpg";
import royalPalaceExterior from "@/assets/royal-palace-exterior.jpg";
import universityHeightsExterior from "@/assets/university-heights-exterior.jpg";
import greenValleyExterior from "@/assets/green-valley-exterior.jpg";
import harmonyHallExterior from "@/assets/harmony-hall-exterior.jpg";

interface HostelCardProps {
  id: string;
  name: string;
  description?: string;
  location: string;
  detailed_address?: string;
  price_per_semester: number;
  price_per_month?: number;
  rating: number;
  total_reviews: number;
  rooms_available: number;
  total_rooms?: number;
  distance_from_campus?: string;
  amenities: string[];
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  isFavorited?: boolean;
  main_picture?: string;
  images?: string[];
}

export const HostelCard = (hostel: HostelCardProps) => {
  const [favorited, setFavorited] = useState(hostel.isFavorited || false);
  const [showDetails, setShowDetails] = useState(false);

  const getHostelImage = (hostelName: string, mainPicture?: string, images?: string[]) => {
    // Prioritize uploaded main picture over static images
    if (mainPicture) {
      return mainPicture;
    }
    
    // Check if there are uploaded images and use the first one as main picture
    if (images && images.length > 0) {
      return images[0];
    }
    
    switch (hostelName) {
      case 'Campus View Residence': return campusViewExterior;
      case 'AAMUSTED Student Lodge': return studentLodgeExterior;
      case 'Royal Student Palace': return royalPalaceExterior;
      case 'University Heights Hostel': return universityHeightsExterior;
      case 'Green Valley Hostel': return greenValleyExterior;
      case 'Harmony Hall': return harmonyHallExterior;
      default: return "/placeholder.svg";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-3 w-3" />;
      case 'parking': return <Car className="h-3 w-3" />;
      case 'common room': return <Users className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleContact = () => {
    if (hostel.contact_whatsapp) {
      window.open(`https://wa.me/${hostel.contact_whatsapp.replace(/\D/g, '')}`);
    } else if (hostel.contact_phone) {
      window.open(`tel:${hostel.contact_phone}`);
    } else if (hostel.contact_email) {
      window.open(`mailto:${hostel.contact_email}`);
    }
  };

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-primary transition-all duration-300 border-border">
        {/* Image Section */}
        <div className="relative">
          <img 
            src={getHostelImage(hostel.name, hostel.main_picture, hostel.images)} 
            alt={hostel.name}
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
            {hostel.rooms_available} rooms available
          </Badge>
        </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">{hostel.name}</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">₵{hostel.price_per_semester}</div>
              <div className="text-xs text-muted-foreground">per semester</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">{hostel.location}</span>
            <span className="mx-2">•</span>
            <span>{hostel.distance_from_campus}</span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-secondary fill-current" />
            <span className="ml-1 font-medium text-sm">{hostel.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({hostel.total_reviews} reviews)</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-3">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center text-xs text-muted-foreground">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="text-xs text-muted-foreground">+{hostel.amenities.length - 3} more</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleContact}
          >
            <Phone className="h-3 w-3 mr-2" />
            Contact
          </Button>
          <Button 
            className="flex-1 bg-gradient-primary hover:opacity-90"
            size="sm"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
    
    <HostelDetailDialog 
      hostel={hostel}
      open={showDetails}
      onOpenChange={setShowDetails}
    />
  </>
  );
};