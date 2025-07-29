import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export const FilterSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([500, 2000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const amenities = [
    "WiFi", "Parking", "Common Room", "Kitchen", "Laundry", 
    "Security", "Study Room", "Air Conditioning", "Generator"
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setPriceRange([500, 2000]);
    setSelectedAmenities([]);
    setActiveFilters([]);
  };

  const applyFilters = () => {
    const filters = [];
    if (priceRange[0] > 500 || priceRange[1] < 2000) {
      filters.push(`₵${priceRange[0]} - ₵${priceRange[1]}`);
    }
    if (selectedAmenities.length > 0) {
      filters.push(...selectedAmenities);
    }
    setActiveFilters(filters);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {/* Quick Sort */}
        <Select defaultValue="recommended">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="distance">Closest to Campus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {filter}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 ml-2 hover:bg-transparent"
                onClick={() => setActiveFilters(prev => prev.filter((_, i) => i !== index))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <Card className="p-6 border border-border shadow-elegant">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Price Range</Label>
              <div className="space-y-3">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={3000}
                  min={300}
                  step={50}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>₵{priceRange[0]}</span>
                  <span>₵{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Room Type</Label>
              <div className="space-y-3">
                {["Single Room", "Shared Room", "Studio", "Apartment"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} />
                    <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Amenities</Label>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button variant="ghost" onClick={clearFilters}>
              Clear All
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applyFilters} className="bg-gradient-primary">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};