
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property } from "@/lib/types";
import { formatPrice, timeAgo, truncateText, stripHtml } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/property/${property.id}`}>
      <Card className="property-card overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img
            alt={property.title}
            className="property-image w-full object-cover"
            height={225}
            src={property.images[0]}
            width={400}
          />
          <Badge
            className="absolute top-2 right-2"
            variant={property.type === "sale" ? "default" : "secondary"}
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
          {property.featured && (
            <Badge
              className="absolute top-2 left-2 bg-realty-accent text-white"
              variant="outline"
            >
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="pt-4 flex-grow">
          <h3 className="text-lg font-bold">{property.title}</h3>
          <div className="text-realty-navy font-bold text-xl mt-1">
            {formatPrice(property.price, property.type)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
            <span>{property.bedrooms} beds</span>
            <span>•</span>
            <span>{property.bathrooms} baths</span>
            <span>•</span>
            <span>{property.area} sq ft</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {truncateText(stripHtml(property.description), 100)}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            {property.location.city}, {property.location.state}
          </div>
          <div className="text-xs text-muted-foreground">
            {timeAgo(property.createdAt)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
