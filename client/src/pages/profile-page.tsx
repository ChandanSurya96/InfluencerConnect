import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, User, Save } from "lucide-react";
import { UserRole } from "@shared/schema";
import InfluencerProfileForm from "@/components/profile/influencer-profile-form";
import BrandProfileForm from "@/components/profile/brand-profile-form";

export default function ProfilePage() {
  const { user, userWithProfile, isLoading, isProfileLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("view");
  
  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  const isInfluencer = user.role === UserRole.INFLUENCER;
  const isBrand = user.role === UserRole.BRAND;
  
  // Get the appropriate profile based on user role
  const profile = isInfluencer 
    ? userWithProfile?.influencerProfile 
    : isBrand 
      ? userWithProfile?.brandProfile 
      : null;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500">Manage your personal information and preferences</p>
        </div>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="view" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>View</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex gap-4 items-center">
                    <div className={`h-16 w-16 ${isInfluencer ? 'rounded-full' : 'rounded-md'} bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold`}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <span className="capitalize">{user.role}</span>
                        {profile?.verified && (
                          <span className="ml-2 bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">Verified</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">About</h3>
                    <p className="text-gray-700 mt-2">{user.bio || "No bio added yet."}</p>
                  </div>
                  
                  {profile ? (
                    <div className="space-y-6">
                      {isInfluencer && (
                        <>
                          <div>
                            <h3 className="text-lg font-semibold">Category</h3>
                            <p className="text-gray-700 mt-2">{profile.category}</p>
                          </div>
                          
                          {profile.platforms && Array.isArray(profile.platforms) && profile.platforms.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold">Platforms</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {profile.platforms.map((platform: string, idx: number) => (
                                  <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {platform}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-lg font-semibold">Follower Count</h3>
                              <p className="text-gray-700 mt-2">{profile.followerCount?.toLocaleString() || "Not specified"}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">Engagement Rate</h3>
                              <p className="text-gray-700 mt-2">{profile.engagementRate || "Not specified"}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">Pricing</h3>
                              <p className="text-gray-700 mt-2">{profile.pricing || "Not specified"}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">Location</h3>
                              <p className="text-gray-700 mt-2">{profile.location || "Not specified"}</p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {isBrand && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-lg font-semibold">Company Type</h3>
                              <p className="text-gray-700 mt-2">{profile.companyType}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">Industry</h3>
                              <p className="text-gray-700 mt-2">{profile.industry}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">Budget</h3>
                              <p className="text-gray-700 mt-2">{profile.budget || "Not specified"}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">Location</h3>
                              <p className="text-gray-700 mt-2">{profile.location || "Not specified"}</p>
                            </div>
                          </div>
                          
                          {profile.marketingGoals && (
                            <div>
                              <h3 className="text-lg font-semibold">Marketing Goals</h3>
                              <p className="text-gray-700 mt-2">{profile.marketingGoals}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                      <h3 className="text-lg font-semibold text-yellow-800">Complete Your Profile</h3>
                      <p className="text-yellow-700 mt-2">
                        Your profile is not complete. Please click the "Edit" tab to add more information and help potential partners find you.
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => setActiveTab("edit")}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Complete Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="edit" className="mt-4">
              {isInfluencer && (
                <InfluencerProfileForm 
                  existingProfile={userWithProfile?.influencerProfile}
                />
              )}
              
              {isBrand && (
                <BrandProfileForm 
                  existingProfile={userWithProfile?.brandProfile}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
