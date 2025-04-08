import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { UserRole } from "@shared/schema";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Check if user is an admin
  if (!user || user.role !== UserRole.ADMIN) {
    return <Redirect to="/" />;
  }
  
  return <AdminDashboard />;
}
