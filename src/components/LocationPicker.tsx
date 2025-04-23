
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  onChange: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

export function LocationPicker({ onChange, initialLocation }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!mapInstanceRef.current) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          
          // Update map view
          mapInstanceRef.current?.setView([lat, lng], 15);
          
          // Remove existing marker if any
          if (markerRef.current) {
            markerRef.current.remove();
          }
          
          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
          
          // Call onChange with new coordinates
          onChange({ lat, lng });
          
          toast({
            title: "Location found",
            description: "Map has been centered to your current location",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not access your location. Please try again or pick manually.",
            variant: "destructive",
          });
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast({
        title: "Geolocation Unavailable",
        description: "Your browser doesn't support geolocation. Please pick location manually.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isMapVisible || !mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        initialLocation || [47.6101, -122.2015], 
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Add click handler to map
      mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
        
        // Call onChange with new coordinates
        onChange({ lat, lng });
      });

      // If initial location is provided, add marker
      if (initialLocation) {
        markerRef.current = L.marker([initialLocation.lat, initialLocation.lng])
          .addTo(mapInstanceRef.current);
      }
    }

    // Ensure map is sized correctly
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);

  }, [isMapVisible, initialLocation, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapVisible(!isMapVisible)}
          className="flex-1"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isMapVisible ? "Hide Map" : "Pick Location on Map"}
        </Button>
        
        {isMapVisible && (
          <Button
            type="button"
            variant="secondary"
            onClick={getCurrentLocation}
            className="w-auto"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Use Current Location
          </Button>
        )}
      </div>
      
      {isMapVisible && (
        <div 
          ref={mapRef} 
          className="h-[300px] w-full rounded-md border"
          data-testid="location-picker-map"
        />
      )}
    </div>
  );
}
