import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Message as MessageType } from "@shared/schema";
import { X, Phone, Video, MoreHorizontal, PaperclipIcon, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface MessageInterfaceProps {
  recipientId: number;
  recipient: User;
  onClose?: () => void;
  isModal?: boolean;
}

interface MessageBubbleProps {
  message: MessageType;
  isCurrentUser: boolean;
}

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const timeString = message.createdAt instanceof Date 
    ? format(message.createdAt, "h:mm a")
    : format(new Date(message.createdAt), "h:mm a");
  
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`rounded-lg shadow-sm p-3 max-w-[80%] ${
        isCurrentUser ? "bg-primary-100" : "bg-white"
      }`}>
        <p className="text-gray-800">{message.content}</p>
        <p className="text-xs text-gray-400 mt-1">{timeString}</p>
      </div>
    </div>
  );
}

export default function MessageInterface({ recipientId, recipient, onClose, isModal = false }: MessageInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<MessageType[]>({
    queryKey: ["/api/messages", recipientId],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(`/api/messages/${recipientId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        recipientId,
        content,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", recipientId] });
      setNewMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessageMutation.mutate(newMessage);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (!user) return null;
  
  const containerClasses = isModal 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    : "flex flex-col w-full h-full";
  
  const contentClasses = isModal
    ? "bg-white rounded-lg shadow-xl max-w-3xl w-full h-[80vh] flex flex-col"
    : "bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full";
  
  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold mr-3">
              {getInitials(recipient.name)}
            </div>
            <div>
              <h3 className="font-semibold">{recipient.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{recipient.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message below</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === user.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <PaperclipIcon className="h-4 w-4 text-gray-500" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={newMessage.trim() === "" || sendMessageMutation.isPending}
              className="rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
