import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { UserRole } from "@shared/schema";

export function ProtectedRoute({
  path,
  component: Component,
  adminRequired = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  adminRequired?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Restrict access to admin routes
  if (adminRequired && user.role !== UserRole.ADMIN) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // If path is /admin but user is not an admin, redirect to home
  if (path === "/admin" && user.role !== UserRole.ADMIN) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
