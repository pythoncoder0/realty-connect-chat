
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyMap } from "@/components/PropertyMap";
import { useAppStore } from "@/lib/store";
import { getProperties, filterProperties } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PropertyFilter } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const Listings = () => {
  const { properties, filteredProperties, setProperties, setFilteredProperties, user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams] = useSearchParams();
  const { toast: useToastFunc } = useToast();
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const fetchedProperties = await getProperties();
        
        if (fetchedProperties.length === 0) {
          useToastFunc({
            title: "No properties found",
            description: "There are no properties in the system yet.",
          });
        }
        
        setProperties(fetchedProperties);
        
        // Apply search query from URL if present
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
          const filtered = filterProperties(fetchedProperties, { searchQuery });
          setFilteredProperties(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [setProperties, setFilteredProperties, searchParams, useToastFunc]);
  
  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      default:
        return 0;
    }
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Property Listings</h1>
          
          {user && (
            <Link to="/publish">
              <Button>
                + Add New Property
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
          </p>
          
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
        </div>
        
        {showMap && sortedProperties.length > 0 && (
          <div className="mb-8 h-[400px] rounded-lg overflow-hidden border">
            <PropertyMap properties={sortedProperties} />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <PropertyFilters />
          </div>
          
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : sortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to find properties or add a new one.
                </p>
                {user && (
                  <Button className="mt-4" asChild>
                    <Link to="/publish">Publish a Property</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Listings;
