
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PropertyForm } from "@/components/PropertyForm";
import { getCurrentUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PublishProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  
  // Check if the user is logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to publish a property",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/publish" } });
    }
  }, [user, navigate, toast]);
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container py-8 flex-1 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to publish a property.</p>
          <Button asChild>
            <a href="/login">Go to Login</a>
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
          <a href="/listings" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to listings
          </a>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Publish a Property</h1>
        
        <div className="max-w-4xl">
          <PropertyForm />
        </div>
      </main>
    </div>
  );
};

export default PublishProperty;
