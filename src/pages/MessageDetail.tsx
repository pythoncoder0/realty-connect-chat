
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { getMessages, getPropertyById, sendMessage } from "@/lib/api";
import { getCurrentUser } from "@/lib/api";
import { Message, Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MessageDetail = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId || !user) return;
      
      setLoading(true);
      
      try {
        // Get messages for this conversation
        const fetchedMessages = await getMessages(conversationId);
        setMessages(fetchedMessages);
        
        // Get property details
        if (fetchedMessages.length > 0) {
          const [propertyId] = conversationId.split('_');
          const fetchedProperty = await getPropertyById(propertyId);
          setProperty(fetchedProperty);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        toast({
          title: "Error",
          description: "Failed to load the conversation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
  }, [conversationId, user, toast]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !conversationId || !property) return;
    
    // Determine recipient ID (the other person in the conversation)
    const otherUserId = messages.length > 0
      ? (messages[0].senderId === user.id ? messages[0].receiverId : messages[0].senderId)
      : property.ownerId !== user.id ? property.ownerId : "user1"; // Fallback
    
    try {
      const sentMessage = await sendMessage(
        conversationId,
        newMessage,
        user.id,
        user.name,
        otherUserId
      );
      
      // Update local messages state
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send your message",
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container py-8 flex-1 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to view messages.</p>
          <Button asChild>
            <Link to="/login">Go to Login</Link>
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
          <Link to="/messages" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to messages
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded-lg"></div>
            <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {property?.title}
                </h1>
                <p className="text-muted-foreground">
                  Conversation with {messages.length > 0 && messages[0].senderId !== user.id
                    ? messages[0].senderName
                    : property?.ownerName || "Agent"
                  }
                </p>
              </div>
              
              {property && (
                <Button asChild>
                  <Link to={`/property/${property.id}`}>View Property</Link>
                </Button>
              )}
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.senderId === user.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">
                            {isCurrentUser ? "You" : message.senderName}
                          </div>
                          <div>{message.text}</div>
                          <div className="text-xs opacity-70 mt-1 text-right">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit">Send</Button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default MessageDetail;
