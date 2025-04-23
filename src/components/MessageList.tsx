
import { Link } from "react-router-dom";
import { MessageConversation } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MessageListProps {
  conversations: MessageConversation[];
}

export function MessageList({ conversations }: MessageListProps) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Link 
          key={conversation.id} 
          to={`/messages/${conversation.id}`}
          className="block"
        >
          <div className="border rounded-lg p-4 hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-full p-2 text-muted-foreground">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{conversation.propertyTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    With {conversation.otherUserName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {formatDate(conversation.lastMessageAt)}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/property/${conversation.propertyId}`;
                  }}
                >
                  View Property
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm line-clamp-1 text-muted-foreground">
              {conversation.lastMessageText}
            </div>
            {conversation.unreadCount > 0 && (
              <div className="mt-2 flex justify-end">
                <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                  {conversation.unreadCount} new
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
