import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { UserRole } from "@shared/schema";
import { 
  Home, 
  User, 
  Search, 
  MessageSquare, 
  Bookmark, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, count, active, onClick }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={`flex items-center p-2 rounded-md ${
          active 
            ? "text-primary-600 bg-primary-50 font-medium" 
            : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
        }`}
        onClick={onClick}
      >
        <div className="w-5 h-5 mr-3">{icon}</div>
        <span>{label}</span>
        {count !== undefined && (
          <span className="ml-auto bg-secondary-500 text-white text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  if (!user) return null;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-500 flex items-center gap-2">
          <span>Collab<span className="text-secondary-500">Match</span></span>
        </h1>
      </div>
      
      {/* User Profile Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
            <User size={18} />
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavItem 
          href="/" 
          icon={<Home size={18} />} 
          label="Dashboard" 
          active={location === "/"} 
        />
        <NavItem 
          href="/profile" 
          icon={<User size={18} />} 
          label="My Profile" 
          active={location === "/profile"} 
        />
        <NavItem 
          href="/discover" 
          icon={<Search size={18} />} 
          label="Discover" 
          active={location === "/discover"} 
        />
        <NavItem 
          href="/messages" 
          icon={<MessageSquare size={18} />} 
          label="Messages" 
          count={0}
          active={location.startsWith("/messages")} 
        />
        <NavItem 
          href="/saved" 
          icon={<Bookmark size={18} />} 
          label="Saved" 
          active={location === "/saved"} 
        />
        
        {/* Admin link - only for admin users */}
        {user.role === UserRole.ADMIN && (
          <NavItem 
            href="/admin" 
            icon={<ShieldCheck size={18} />} 
            label="Admin Panel" 
            active={location === "/admin"} 
          />
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <NavItem 
          href="/settings" 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={location === "/settings"} 
        />
        <NavItem 
          href="#" 
          icon={<LogOut size={18} />} 
          label="Logout" 
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
}
