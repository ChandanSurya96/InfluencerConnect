import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";
import { UserWithProfile } from "@shared/schema";
import { 
  Check, 
  Bookmark, 
  MessageSquare,
  Instagram,
  Youtube,
  Twitter,
  Twitch,
  CircleFadingPlus
} from "lucide-react";
import { Link } from "wouter";
import ProfileDetailModal from "../profile/profile-detail-modal";

interface InfluencerCardProps {
  influencer: {
    user: User;
    profile: any;
  };
}

// Helper function to get the platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "Instagram":
      return <Instagram className="mr-1 h-3 w-3 text-purple-600" />;
    case "YouTube":
      return <Youtube className="mr-1 h-3 w-3 text-red-500" />;
    case "Twitter":
      return <Twitter className="mr-1 h-3 w-3 text-blue-400" />;
    case "TikTok":
      return <CircleFadingPlus className="mr-1 h-3 w-3" />;
    case "Twitch":
      return <Twitch className="mr-1 h-3 w-3 text-purple-500" />;
    default:
      return null;
  }
};

export default function InfluencerCard({ influencer }: InfluencerCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { user, profile } = influencer;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        onClick={() => setShowModal(true)}
      >
        <div className="relative">
          <div className="w-full h-24 bg-gradient-to-r from-primary-500 to-primary-400 object-cover"></div>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2">
            <div className="h-16 w-16 rounded-full border-4 border-white bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
        <div className="p-4 pt-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{profile.category}</p>
            </div>
            {profile.verified && (
              <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                <Check className="inline-block mr-1 h-3 w-3" /> Verified
              </div>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.platforms && Array.isArray(profile.platforms) && profile.platforms.map((platform: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                {getPlatformIcon(platform)}
                {platform}
              </Badge>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="flex gap-3">
              <div>
                <span className="font-medium">{profile.followerCount.toLocaleString()}</span>
                <span className="text-gray-500 block text-xs">Followers</span>
              </div>
              {profile.engagementRate && (
                <div>
                  <span className="font-medium">{profile.engagementRate}</span>
                  <span className="text-gray-500 block text-xs">Engagement</span>
                </div>
              )}
            </div>
            {profile.pricing && (
              <div>
                <span className="text-green-600 font-medium">{profile.pricing}</span>
                <span className="text-gray-500 block text-xs text-right">per campaign</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Link href={`/messages/${user.id}`}>
              <Button className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {showModal && (
        <ProfileDetailModal 
          user={user}
          profile={profile}
          isInfluencer
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
