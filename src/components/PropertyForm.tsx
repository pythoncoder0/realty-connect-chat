
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { Property } from "@/lib/types";
import { getCurrentUser, publishProperty } from "@/lib/api";

export function PropertyForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "<p>Describe the property in detail...</p>",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    type: "sale",
    images: [] as string[],
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => 
        URL.createObjectURL(file)
      );
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (
      !formData.title || 
      !formData.description || 
      !formData.price || 
      !formData.bedrooms || 
      !formData.bathrooms || 
      !formData.area || 
      !formData.address || 
      !formData.city || 
      !formData.state || 
      !formData.zip
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.images.length === 0) {
      toast({
        title: "Missing Images",
        description: "Please upload at least one property image",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Get current user
    const user = getCurrentUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to publish a property",
        variant: "destructive",
      });
      setIsSubmitting(false);
      navigate("/login");
      return;
    }
    
    try {
      // Create a new property using the publishProperty API function
      const newPropertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          // Random coordinates for demo (Seattle area)
          lat: 47.6 + (Math.random() * 0.1),
          lng: -122.3 + (Math.random() * 0.1),
        },
        images: formData.images,
        featured: false,
        type: formData.type as 'sale' | 'rent',
        ownerId: user.id,
        ownerName: user.name,
      };
      
      const newProperty = await publishProperty(newPropertyData);
      
      toast({
        title: "Property Published!",
        description: "Your property listing has been published successfully",
      });
      
      // Replace toast.success with the toast from sonner
      toast({
        title: "Success",
        description: "Property published successfully! You can now view your property listing.",
      });
      
      navigate(`/property/${newProperty.id}`);
    } catch (error) {
      console.error("Error publishing property:", error);
      toast({
        title: "Publication Failed",
        description: "There was an error publishing your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground">Provide the core details about your property</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Modern Apartment in Downtown" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            value={formData.price} 
            onChange={handleChange} 
            placeholder="450000" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Property Type</Label>
        <RadioGroup value={formData.type} onValueChange={handleTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sale" id="sale" />
            <Label htmlFor="sale">For Sale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rent" id="rent" />
            <Label htmlFor="rent">For Rent</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input 
            id="bedrooms" 
            name="bedrooms" 
            type="number" 
            value={formData.bedrooms} 
            onChange={handleChange} 
            placeholder="3"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input 
            id="bathrooms" 
            name="bathrooms" 
            type="number" 
            value={formData.bathrooms} 
            onChange={handleChange} 
            placeholder="2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="area">Area (sq ft)</Label>
          <Input 
            id="area" 
            name="area" 
            type="number" 
            value={formData.area} 
            onChange={handleChange} 
            placeholder="1200"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Description</h2>
        <Textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="min-h-[200px]"
        />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Location</h2>
        <p className="text-muted-foreground">Where is your property located?</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="123 Main St"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              placeholder="Seattle"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              name="state" 
              value={formData.state} 
              onChange={handleChange} 
              placeholder="WA"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input 
              id="zip" 
              name="zip" 
              value={formData.zip} 
              onChange={handleChange} 
              placeholder="98101"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Property Images</h2>
        
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Label htmlFor="images" className="cursor-pointer block">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload-cloud"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  SVG, PNG, JPG or GIF (max. 5MB each)
                </p>
              </div>
            </div>
            <Input 
              id="images" 
              name="images" 
              type="file" 
              multiple
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden" 
            />
          </Label>
        </div>
        
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={img} 
                  alt={`Property image ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex gap-4 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/listings')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Property'}
        </Button>
      </div>
    </form>
  );
}
