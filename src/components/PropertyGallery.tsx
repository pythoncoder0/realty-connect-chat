
import { useState } from "react";
import { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  property: Property;
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
        <img
          alt={property.title}
          className="object-cover w-full h-full transition-all"
          src={property.images[selectedImage]}
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {property.images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative flex-shrink-0 h-20 w-24 cursor-pointer overflow-hidden rounded-md",
              selectedImage === index && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedImage(index)}
          >
            <img
              alt={`Property image ${index + 1}`}
              className="object-cover h-full w-full"
              src={image}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
