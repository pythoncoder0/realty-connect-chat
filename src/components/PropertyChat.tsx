
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { getMessages, sendMessage } from "@/lib/api";
import { Message, Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { timeAgo } from "@/lib/utils";
import { generateChatId } from "@/lib/utils";

interface PropertyChatProps {
  property: Property;
}

export function PropertyChat({ property }: PropertyChatProps) {
  const { user, messages, addMessage } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatId = user ? generateChatId(user.id, property.id) : "";
  const currentMessages = messages[chatId] || [];
  
  useEffect(() => {
    if (user && chatId) {
      setLoading(true);
      getMessages(chatId)
        .then(msgs => {
          msgs.forEach(msg => addMessage(chatId, msg));
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load messages:", err);
          setLoading(false);
        });
    }
  }, [user, chatId, addMessage]);
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !input.trim()) return;
    
    try {
      const sentMessage = await sendMessage(
        chatId,
        input,
        user.id,
        user.name,
        property.ownerId
      );
      
      addMessage(chatId, sentMessage);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  if (!user) {
    return (
      <div className="border rounded-lg p-4 bg-muted/50 text-center space-y-4">
        <h3 className="font-medium">Contact Agent</h3>
        <p className="text-sm text-muted-foreground">
          Please login or register to contact the agent about this property.
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/login">Login</a>
          </Button>
          <Button size="sm" asChild>
            <a href="/register">Register</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-[400px]">
      <div className="bg-muted/30 p-3 border-b">
        <h3 className="font-medium">Contact {property.ownerName}</h3>
        <p className="text-sm text-muted-foreground">About {property.title}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground text-sm">
            Loading messages...
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.senderId === user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className="text-xs mt-1 opacity-70">
                  {message.senderId === user.id ? "You" : message.senderName},{" "}
                  {timeAgo(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
