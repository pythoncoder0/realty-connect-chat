
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyMap } from "@/components/PropertyMap";
import { useAppStore } from "@/lib/store";
import { getProperties } from "@/lib/api";

const Index = () => {
  const { properties, setProperties } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const fetchedProperties = await getProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [setProperties]);
  
  // Filter featured properties
  const featuredProperties = properties.filter(prop => prop.featured);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-realty-navy text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Find Your Dream Home with RealtyConnect
              </h1>
              <p className="text-lg md:text-xl text-muted">
                Browse through our curated collection of properties for sale and rent.
                Connect with agents in real-time.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/listings">Browse Listings</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-full min-h-[300px]">
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <img
                  alt="Modern house with pool"
                  className="object-cover w-full h-full rounded-lg"
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Find Your Perfect Property
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Search from thousands of properties in your preferred location.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Search by location, property type..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Link to={{
                  pathname: "/listings",
                  search: searchQuery ? `?search=${searchQuery}` : ""
                }}>
                  <Button type="submit">Search</Button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-12 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Featured Properties
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Explore our handpicked selection of premium properties.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden h-[400px] animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProperties.slice(0, 3).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link to="/listings">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Discover Properties on the Map
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Explore properties in your area of interest.
              </p>
            </div>
          </div>
          <div className="h-[500px] rounded-lg overflow-hidden border shadow-sm">
            <PropertyMap properties={properties} />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-realty-navy text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RealtyConnect</h3>
              <p className="text-muted">
                Your trusted partner in finding the perfect property that meets your needs and dreams.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/listings" className="hover:underline">All Properties</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:underline">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic">
                <p>123 Real Estate Avenue</p>
                <p>Seattle, WA 98101</p>
                <p className="mt-2">Email: info@realtyconnect.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p>&copy; 2025 RealtyConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
