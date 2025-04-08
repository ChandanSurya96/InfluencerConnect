import { Link, useLocation } from "wouter";
import { Home, User, Search, MessageSquare, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between z-10">
      <Link href="/home">
        <a className={`flex flex-col items-center ${
          location === "/home" ? "text-primary-500" : "text-gray-500 hover:text-primary-500"
        }`}>
          <Home className="text-lg" />
          <span className="text-xs mt-1">Home</span>
        </a>
      </Link>
      
      <Link href="/discover">
        <a className={`flex flex-col items-center ${
          location === "/discover" ? "text-primary-500" : "text-gray-500 hover:text-primary-500"
        }`}>
          <Search className="text-lg" />
          <span className="text-xs mt-1">Discover</span>
        </a>
      </Link>
      
      <Link href="/about">
        <a className={`flex flex-col items-center ${
          location === "/about" || location === "/" ? "text-primary-500" : "text-gray-500 hover:text-primary-500"
        }`}>
          <Info className="text-lg" />
          <span className="text-xs mt-1">About</span>
        </a>
      </Link>
      
      <Link href="/messages">
        <a className={`flex flex-col items-center relative ${
          location.startsWith("/messages") ? "text-primary-500" : "text-gray-500 hover:text-primary-500"
        }`}>
          <MessageSquare className="text-lg" />
          <span className="text-xs mt-1">Chat</span>
          {/* Uncomment when we have unread message counts
          <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
          */}
        </a>
      </Link>
      
      <Link href="/profile">
        <a className={`flex flex-col items-center ${
          location === "/profile" ? "text-primary-500" : "text-gray-500 hover:text-primary-500"
        }`}>
          <User className="text-lg" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </Link>
    </nav>
  );
}
