import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PropertyGallery } from "@/components/PropertyGallery";
import { PropertyMap } from "@/components/PropertyMap";
import { PropertyChat } from "@/components/PropertyChat";
import { useAppStore } from "@/lib/store";
import { getPropertyById } from "@/lib/api";
import { Property } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mockData";

const PropertyDetail = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      
      try {
        setLoading(true);
        const fetchedProperty = await getPropertyById(propertyId);
        setProperty(fetchedProperty);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError("Could not load property details. It may not exist or has been removed.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container py-8 flex-1">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted w-3/4 rounded"></div>
            <div className="aspect-[16/9] bg-muted rounded"></div>
            <div className="h-4 bg-muted w-1/2 rounded"></div>
            <div className="h-4 bg-muted w-full rounded"></div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container py-8 flex-1 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/listings">Browse Other Properties</Link>
          </Button>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container py-8 flex-1">
        <div className="mb-6">
          <Link to="/listings" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to listings
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Property Details */}
          <div className="lg:w-2/3 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <Badge variant={property.type === "sale" ? "default" : "secondary"}>
                  {property.type === "sale" ? "For Sale" : "For Rent"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
              </p>
            </div>
            
            <PropertyGallery property={property} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="font-semibold">{property.area} sqft</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listed</p>
                <p className="font-semibold">{formatDate(property.createdAt)}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: property.description }} 
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <PropertyMap property={property} />
              </div>
            </div>
          </div>
          
          {/* Right Column: Price and Contact */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold mb-2 text-realty-navy">
                {formatPrice(property.price, property.type)}
              </div>
              
              <div className="flex items-center gap-2 py-4 border-b">
                <img
                  src={mockUsers.find(u => u.id === property.ownerId)?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
                  alt={property.ownerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{property.ownerName}</p>
                  <p className="text-sm text-muted-foreground">Listing Agent</p>
                </div>
              </div>
              
              <div className="mt-4">
                <PropertyChat property={property} />
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-6 border">
              <h3 className="font-semibold mb-2">Share this property</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Copy Link</Button>
                <Button variant="outline" size="sm">Email</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;
