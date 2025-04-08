import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Search, MessageSquare, Users, TrendingUp, BarChart } from "lucide-react";
import { UserRole } from "@shared/schema";

export default function HomePage() {
  const { user, userWithProfile, isProfileLoading } = useAuth();

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isInfluencer = user?.role === UserRole.INFLUENCER;
  const isBrand = user?.role === UserRole.BRAND;
  const hasProfile = 
    (isInfluencer && userWithProfile?.influencerProfile) || 
    (isBrand && userWithProfile?.brandProfile);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'User'}</p>
        </div>
      </div>

      {!hasProfile && (
        <Card className="bg-primary-50 border-primary-100">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-gray-600 mb-4">
                  Your profile isn't complete yet. Add more details to help potential {isInfluencer ? 'brands' : 'influencers'} find you.
                </p>
                <Link href="/profile">
                  <Button>Complete Profile</Button>
                </Link>
              </div>
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                <Users size={36} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-gray-500">+10% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">12 unread</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">3 new since last visit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasProfile ? '100%' : '50%'}</div>
            <p className="text-xs text-gray-500">{hasProfile ? 'Fully completed' : 'In progress'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent platform activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg border bg-background">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                  <TrendingUp size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Profile views are up</h4>
                  <p className="text-sm text-gray-500">Your profile was viewed by 5 new visitors</p>
                </div>
                <div className="text-sm text-gray-500">
                  2 hours ago
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg border bg-background">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                  <MessageSquare size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">New message received</h4>
                  <p className="text-sm text-gray-500">You have a new message from a potential collaborator</p>
                </div>
                <div className="text-sm text-gray-500">
                  Yesterday
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg border bg-background">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                  <Search size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Your profile matched a search</h4>
                  <p className="text-sm text-gray-500">Your profile appeared in 3 search results</p>
                </div>
                <div className="text-sm text-gray-500">
                  2 days ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Navigate to frequently used sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/discover">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Discover {isInfluencer ? 'Brands' : 'Influencers'}
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
              {user?.role === UserRole.ADMIN && (
                <Link href="/admin">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
