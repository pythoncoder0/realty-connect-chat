
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAppStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/MessageList";
import { useToast } from "@/hooks/use-toast";
import { MessageConversation } from "@/lib/types";
import { getUserConversations } from "@/lib/api";

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  
  // Check if the user is logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your messages",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/messages" } });
    } else {
      // Load user conversations
      loadConversations(currentUser.id);
    }
  }, [navigate, toast]);
  
  const loadConversations = async (userId: string) => {
    setLoading(true);
    try {
      const userConversations = await getUserConversations(userId);
      setConversations(userConversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load your conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container py-8 flex-1 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your messages.</p>
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
        <h1 className="text-3xl font-bold mb-8">Your Messages</h1>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <MessageList conversations={conversations} />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any message conversations yet.
            </p>
            <Button asChild>
              <a href="/listings">Browse Properties</a>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
