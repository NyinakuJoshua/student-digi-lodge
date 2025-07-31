import { useEffect, useState } from "react";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { FilterSection } from "@/components/ui/filter-section";
import { HostelCard } from "@/components/ui/hostel-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Users, Shield, Clock, ArrowRight } from "lucide-react";
import campusHeroBg from "@/assets/campus-hero-bg.jpg";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [hostels, setHostels] = useState<any[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    const fetchHostels = async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });
      
      if (data) {
        setHostels(data);
        setFilteredHostels(data);
      }
      setLoading(false);
    };

    fetchHostels();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = hostels;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(hostel => 
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.amenities.some((amenity: string) => 
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(hostel => {
        const price = hostel.price_per_semester;
        switch (priceRange) {
          case '₵500 - ₵1000': return price >= 500 && price <= 1000;
          case '₵1000 - ₵1500': return price >= 1000 && price <= 1500;
          case '₵1500+': return price >= 1500;
          default: return true;
        }
      });
    }

    setFilteredHostels(filtered);
  }, [searchQuery, priceRange, hostels]);

  const handleSearch = () => {
    // Search is handled by useEffect above
  };

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Search",
      description: "Find hostels by location, price, and amenities with our intelligent search"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Listings",
      description: "All hostels are verified and approved by AAMUSTED administration"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Real-time Availability",
      description: "Check current room availability and book instantly"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Student Reviews",
      description: "Read honest reviews from fellow AAMUSTED students"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusHeroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-4 bg-secondary text-secondary-foreground">
            AAMUSTED Official Partner
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect
            <span className="block text-secondary">Student Hostel</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Discover verified, affordable accommodation near AAMUSTED campus. Book with confidence.
          </p>
          
          {/* Hero Search */}
          <Card className="max-w-4xl mx-auto p-6 bg-white/95 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                   <input 
                    type="text"
                    placeholder="Search by location or hostel name..."
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
               <div>
                <select 
                  className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Price Range</option>
                  <option value="₵500 - ₵1000">₵500 - ₵1000</option>
                  <option value="₵1000 - ₵1500">₵1000 - ₵1500</option>
                  <option value="₵1500+">₵1500+</option>
                </select>
              </div>
              <Button className="bg-gradient-primary hover:opacity-90 py-3" onClick={handleSearch}>
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose UniLodge?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make finding and booking student accommodation simple, safe, and reliable for AAMUSTED students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-elegant transition-shadow">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Hostels Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Available Hostels
              </h2>
              <p className="text-muted-foreground">
                {filteredHostels.length} of {hostels.length} hostels found near AAMUSTED campus
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <FilterSection />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading hostels...</div>
            ) : filteredHostels.length > 0 ? (
              filteredHostels.map((hostel) => (
                <HostelCard key={hostel.id} {...hostel} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No hostels found matching your search criteria.
              </div>
            )}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Hostels
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Home Away From Home?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of AAMUSTED students who have found their perfect accommodation through UniLodge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Browse Hostels
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              List Your Hostel
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">UL</span>
                </div>
                <span className="text-xl font-bold text-primary">UniLodge</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Making student accommodation search simple and reliable for AAMUSTED students.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-card-foreground">For Students</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Browse Hostels</a></li>
                <li><a href="#" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground">Student Reviews</a></li>
                <li><a href="#" className="hover:text-foreground">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-card-foreground">For Hostel Owners</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">List Your Hostel</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Owner Resources</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-card-foreground">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 UniLodge. All rights reserved. Built for AAMUSTED students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;