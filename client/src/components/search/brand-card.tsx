import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";
import { Building, Check, Bookmark, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import ProfileDetailModal from "../profile/profile-detail-modal";

interface BrandCardProps {
  brand: {
    user: User;
    profile: any;
  };
}

export default function BrandCard({ brand }: BrandCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { user, profile } = brand;
  
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
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 w-full"></div>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2">
            <div className="h-16 w-16 rounded-md border-4 border-white bg-white flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-bold text-blue-600">{getInitials(user.name)}</span>
            </div>
          </div>
        </div>
        <div className="p-4 pt-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{profile.industry}</p>
            </div>
            <div className="bg-secondary-50 text-secondary-700 px-2 py-1 rounded text-xs font-medium">
              <Building className="inline-block mr-1 h-3 w-3" /> Brand
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
              {profile.industry}
            </Badge>
            {profile.companyType && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                {profile.companyType}
              </Badge>
            )}
            {profile.location && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                {profile.location}
              </Badge>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">{profile.companyType}</span>
              <span className="text-gray-500 block text-xs">Company Type</span>
            </div>
            {profile.budget && (
              <div>
                <span className="text-green-600 font-medium">{profile.budget}</span>
                <span className="text-gray-500 block text-xs text-right">Campaign Budget</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Link href={`/messages/${user.id}`}>
              <Button variant="secondary" className="flex-1">
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
          isInfluencer={false}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
