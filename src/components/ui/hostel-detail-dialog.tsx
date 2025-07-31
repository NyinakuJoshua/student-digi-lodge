import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Star, 
  Users, 
  Wifi, 
  Car, 
  Shield, 
  Utensils,
  Heart,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookingForm } from '@/components/ui/booking-form';
import hostelInterior1 from '@/assets/hostel-interior-1.jpg';
import hostelRoom1 from '@/assets/hostel-room-1.jpg';
import hostelKitchen1 from '@/assets/hostel-kitchen-1.jpg';
import hostelStudy1 from '@/assets/hostel-study-1.jpg';
import GoogleMap from './google-map';

interface HostelDetailDialogProps {
  hostel: {
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
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'WiFi': <Wifi className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
  'Security': <Shield className="h-4 w-4" />,
  'Kitchen': <Utensils className="h-4 w-4" />,
  'Common Room': <Users className="h-4 w-4" />,
};

export function HostelDetailDialog({ hostel, open, onOpenChange }: HostelDetailDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const hostelImages = [hostelInterior1, hostelRoom1, hostelKitchen1, hostelStudy1];

  const handleAddToFavorites = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add hostels to your favorites.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToFavorites(true);
    
    try {
      // First get the user's profile id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: profile.id,
          hostel_id: hostel.id,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already in favorites",
            description: "This hostel is already in your favorites.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Added to favorites",
          description: `${hostel.name} has been added to your favorites.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to favorites.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const handleContact = (type: 'phone' | 'email' | 'whatsapp') => {
    switch (type) {
      case 'phone':
        if (hostel.contact_phone) {
          window.open(`tel:${hostel.contact_phone}`);
        }
        break;
      case 'email':
        if (hostel.contact_email) {
          window.open(`mailto:${hostel.contact_email}`);
        }
        break;
      case 'whatsapp':
        if (hostel.contact_whatsapp) {
          window.open(`https://wa.me/${hostel.contact_whatsapp.replace(/\D/g, '')}`);
        }
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{hostel.name}</DialogTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {hostel.location}
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {hostel.rating} ({hostel.total_reviews} reviews)
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {hostel.rooms_available} rooms available
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Per Semester:</span>
                      <span className="font-bold">₵{hostel.price_per_semester.toLocaleString()}</span>
                    </div>
                    {hostel.price_per_month && (
                      <div className="flex justify-between">
                        <span>Per Month:</span>
                        <span className="font-bold">₵{hostel.price_per_month.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Location Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <p>{hostel.detailed_address || hostel.location}</p>
                    </div>
                    {hostel.distance_from_campus && (
                      <div>
                        <span className="text-sm text-muted-foreground">Distance from campus:</span>
                        <p>{hostel.distance_from_campus}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {hostel.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About This Hostel</h3>
                  <p className="text-muted-foreground">{hostel.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={handleAddToFavorites} 
                disabled={isAddingToFavorites}
                variant="outline"
                className="flex-1"
              >
                <Heart className="h-4 w-4 mr-2" />
                {isAddingToFavorites ? 'Adding...' : 'Add to Favorites'}
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setIsBookingFormOpen(true)}
              >
                Book Now
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hostelImages.map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${hostel.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amenities">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hostel.amenities.map((amenity, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      {amenityIcons[amenity] || <Shield className="h-4 w-4" />}
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Location & Map</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Full Address:</span>
                    <p className="font-medium">{hostel.detailed_address || hostel.location}</p>
                  </div>
                  {hostel.distance_from_campus && (
                    <div>
                      <span className="text-sm text-muted-foreground">Distance from AAMUSTED Campus:</span>
                      <p className="font-medium text-primary">{hostel.distance_from_campus}</p>
                    </div>
                  )}
                  <div className="mt-6">
                    <GoogleMap 
                      center={{ lat: 7.3369, lng: -2.3284 }}
                      zoom={15}
                      markers={[
                        {
                          position: { lat: 7.3369, lng: -2.3284 },
                          title: hostel.name,
                          info: `<div><strong>${hostel.name}</strong><br/>${hostel.location}</div>`
                        }
                      ]}
                      className="rounded-lg overflow-hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                {hostel.contact_name && (
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Contact Person:</span>
                    <p className="font-medium">{hostel.contact_name}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  {hostel.contact_phone && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleContact('phone')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {hostel.contact_phone}
                    </Button>
                  )}
                  
                  {hostel.contact_email && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleContact('email')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {hostel.contact_email}
                    </Button>
                  )}
                  
                  {hostel.contact_whatsapp && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleContact('whatsapp')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp: {hostel.contact_whatsapp}
                    </Button>
                  )}
                </div>

                {!hostel.contact_phone && !hostel.contact_email && !hostel.contact_whatsapp && (
                  <p className="text-muted-foreground">Contact information not available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      <BookingForm
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        hostel={{
          id: hostel.id,
          name: hostel.name,
          price_per_semester: hostel.price_per_semester,
          price_per_month: hostel.price_per_month,
        }}
      />
    </Dialog>
  );
}