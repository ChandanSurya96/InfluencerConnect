import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Search, MessageSquare, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageInterface from "@/components/messaging/message-interface";

interface Conversation {
  userId: number;
  lastMessage: {
    content: string;
    createdAt: string;
  };
  user: {
    name: string;
    role: string;
  };
}

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const [location, navigate] = useLocation();
  const selectedUserId = params.userId ? parseInt(params.userId) : undefined;
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch conversations
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
  });
  
  // Fetch recipient user if in chat mode
  const { data: selectedUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/profile", selectedUserId],
    queryFn: async ({ queryKey }) => {
      const userId = queryKey[1];
      const res = await fetch(`/api/profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!selectedUserId,
  });
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Filter conversations by search query
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;
  
  // Format date to relative time
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleNewMessage = () => {
    // This would normally open a dialog to select a user to message
    // For this example, we'll just navigate to the discover page
    navigate('/discover');
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 md:flex flex-col ${selectedUserId ? 'hidden' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Messages</h1>
          <div className="mt-3 relative">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="p-2">
          <Button variant="outline" className="w-full" onClick={handleNewMessage}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            // Loading skeletons
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="font-medium text-gray-700">No messages yet</h3>
              <p className="text-gray-500 text-sm">
                Start a conversation with a potential partner
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleNewMessage}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          ) : (
            // Conversation list
            <div>
              {filteredConversations.map((conversation) => (
                <div key={conversation.userId}>
                  <button
                    className={`w-full p-3 flex items-start hover:bg-gray-50 transition-colors ${
                      selectedUserId === conversation.userId ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => navigate(`/messages/${conversation.userId}`)}
                  >
                    <div className={`h-10 w-10 rounded-full flex-shrink-0 bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold mr-3`}>
                      {getInitials(conversation.user.name)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatMessageDate(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.content}</p>
                    </div>
                  </button>
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content - Message Interface */}
      <div className={`flex-1 ${!selectedUserId ? 'hidden md:flex' : 'flex'} items-center justify-center`}>
        {selectedUserId ? (
          isLoadingUser ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : selectedUser ? (
            <MessageInterface 
              recipientId={selectedUserId} 
              recipient={selectedUser} 
            />
          ) : (
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold text-red-600">Error</h2>
              <p className="text-gray-600">Could not load user information</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/messages')}
              >
                Back to Messages
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-center max-w-md p-6">
            <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Your Messages</h2>
            <p className="text-gray-600 mt-2">
              Select a conversation from the sidebar or start a new message to begin chatting.
            </p>
            <Button 
              className="mt-6"
              onClick={handleNewMessage}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Start New Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
