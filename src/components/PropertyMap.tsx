
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/lib/types";

interface PropertyMapProps {
  property?: Property;
  properties?: Property[];
  height?: string;
  onSelectProperty?: (property: Property) => void;
}

export function PropertyMap({ 
  property, 
  properties, 
  height = "400px",
  onSelectProperty 
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([47.6101, -122.2015], 12);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
    
    const map = mapInstanceRef.current;
    
    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    
    // Add markers for single property
    if (property) {
      const { lat, lng } = property.location;
      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${property.title}</b><br>${property.location.address}`);
      
      map.setView([lat, lng], 15);
      marker.openPopup();
    }
    
    // Add markers for multiple properties
    if (properties && properties.length > 0) {
      const bounds = L.latLngBounds([]);
      
      properties.forEach((prop) => {
        const { lat, lng } = prop.location;
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<b>${prop.title}</b><br>${formatPrice(prop.price, prop.type)}`);
        
        if (onSelectProperty) {
          marker.on('click', () => {
            onSelectProperty(prop);
          });
        }
        
        bounds.extend([lat, lng]);
      });
      
      if (properties.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (properties.length === 1) {
        map.setView([properties[0].location.lat, properties[0].location.lng], 15);
      }
    }
    
    // Cleanup
    return () => {
      // Don't destroy the map on component unmount, just let it persist
      // if we were to destroy it: map.remove();
    };
  }, [property, properties, onSelectProperty]);
  
  function formatPrice(price: number, type: 'sale' | 'rent'): string {
    return type === 'rent' ? `$${price}/mo` : `$${price.toLocaleString()}`;
  }
  
  return (
    <div 
      ref={mapRef} 
      className="rounded-lg overflow-hidden"
      style={{ height }}
    ></div>
  );
}
