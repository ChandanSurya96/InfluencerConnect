import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";
import { 
  X, 
  Flag, 
  MessageSquare, 
  Share2, 
  Instagram, 
  Youtube, 
  Twitter, 
  Twitch, 
  CircleFadingPlus,
  Bookmark,
  Building
} from "lucide-react";
import { Link } from "wouter";

interface ProfileDetailModalProps {
  user: User;
  profile: any;
  isInfluencer: boolean;
  onClose: () => void;
}

export default function ProfileDetailModal({ user, profile, isInfluencer, onClose }: ProfileDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Close on escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    // Close when clicking outside the modal
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);
    
    // Prevent scrolling on the body
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Helper function to get the platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="text-xl text-purple-500" />;
      case "YouTube":
        return <Youtube className="text-xl text-red-500" />;
      case "Twitter":
        return <Twitter className="text-xl text-blue-400" />;
      case "TikTok":
        return <CircleFadingPlus className="text-xl" />;
      case "Twitch":
        return <Twitch className="text-xl text-purple-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-400 w-full h-48"></div>
          <button 
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
            onClick={onClose}
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className={`h-24 w-24 ${isInfluencer ? 'rounded-full' : 'rounded-md'} border-4 border-white ${
              isInfluencer 
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                : 'bg-white text-blue-600'
              } flex items-center justify-center text-2xl font-bold`}>
              {getInitials(user.name)}
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-16">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{isInfluencer ? profile.category : profile.industry}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Bookmark size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Flag size={16} className="text-gray-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {isInfluencer ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{profile.followerCount?.toLocaleString()}+</p>
                  <p className="text-gray-500">Total Followers</p>
                </div>
                {profile.engagementRate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">{profile.engagementRate}</p>
                    <p className="text-gray-500">Engagement Rate</p>
                  </div>
                )}
                {profile.pricing && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{profile.pricing}</p>
                    <p className="text-gray-500">Price Per Campaign</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{profile.companyType}</p>
                  <p className="text-gray-500">Company Type</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{profile.industry}</p>
                  <p className="text-gray-500">Industry</p>
                </div>
                {profile.budget && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{profile.budget}</p>
                    <p className="text-gray-500">Campaign Budget</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700">
              {user.bio || "No bio provided."}
            </p>
          </div>
          
          {isInfluencer && profile.platforms && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.platforms.map((platform: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {getPlatformIcon(platform)}
                    </div>
                    <div>
                      <h4 className="font-medium">{platform}</h4>
                      <p className="text-sm text-gray-500">
                        {platform === "YouTube" && "Subscribers"}
                        {platform !== "YouTube" && "Followers"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isInfluencer && profile.portfolio && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Content Portfolio</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* We would display portfolio images here if we had actual data */}
                <div className="rounded-lg w-full h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                  Portfolio Item
                </div>
                <div className="rounded-lg w-full h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                  Portfolio Item
                </div>
                <div className="rounded-lg w-full h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                  Portfolio Item
                </div>
                <div className="rounded-lg w-full h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                  Portfolio Item
                </div>
              </div>
            </div>
          )}
          
          {!isInfluencer && profile.marketingGoals && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Marketing Goals</h3>
              <p className="text-gray-700">
                {profile.marketingGoals}
              </p>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex gap-3">
            <Link href={`/messages/${user.id}`} className="flex-1">
              <Button className="w-full" onClick={onClose}>
                <MessageSquare className="mr-2 h-4 w-4" /> Contact
              </Button>
            </Link>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
