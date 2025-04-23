
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/api";

// Pages
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import PublishProperty from "./pages/PublishProperty";
import Messages from "./pages/Messages";
import MessageDetail from "./pages/MessageDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Add package for Leaflet
import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient();

const App = () => {
  const { setUser } = useAppStore();
  
  // Check for user on load
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, [setUser]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:propertyId" element={<PropertyDetail />} />
            <Route path="/publish" element={<PublishProperty />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<MessageDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
