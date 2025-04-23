
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { filterProperties } from "@/lib/api";
import { PropertyFilter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PropertyFilters() {
  const { properties, setFilteredProperties } = useAppStore();
  const [filters, setFilters] = useState<PropertyFilter>({
    type: 'all',
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: 0,
    searchQuery: '',
  });
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  
  // Apply filters whenever they change
  useEffect(() => {
    const filtered = filterProperties(properties, filters);
    setFilteredProperties(filtered);
  }, [properties, filters, setFilteredProperties]);
  
  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      type: value as 'sale' | 'rent' | 'all',
    });
  };
  
  const handlePriceChange = (value: number[]) => {
    const [min, max] = value;
    setPriceRange([min, max]);
    setFilters({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };
  
  const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters({
      ...filters,
      bedrooms: isNaN(value) ? 0 : value,
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchQuery: e.target.value,
    });
  };
  
  const handleReset = () => {
    setFilters({
      type: 'all',
      minPrice: 0,
      maxPrice: 1000000,
      bedrooms: 0,
      searchQuery: '',
    });
    setPriceRange([0, 1000000]);
  };
  
  return (
    <div className="grid gap-6 p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Narrow down your property search
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Property Type */}
        <div>
          <Label>Property Type</Label>
          <Tabs defaultValue="all" value={filters.type} onValueChange={handleTypeChange} className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sale">For Sale</TabsTrigger>
              <TabsTrigger value="rent">For Rent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Price Range */}
        <div>
          <div className="flex justify-between">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">
              ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            defaultValue={[0, 1000000]}
            value={[priceRange[0], priceRange[1]]}
            min={0}
            max={1000000}
            step={10000}
            onValueChange={handlePriceChange}
            className="mt-4"
          />
        </div>
        
        {/* Bedrooms */}
        <div>
          <Label htmlFor="bedrooms">Minimum Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            value={filters.bedrooms}
            onChange={handleBedroomsChange}
            className="mt-2"
          />
        </div>
        
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by location, title, description..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="mt-2"
          />
        </div>
        
        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
