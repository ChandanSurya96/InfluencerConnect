import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ProfilePage from "@/pages/profile-page";
import DiscoverPage from "@/pages/discover-page";
import MessagesPage from "@/pages/messages-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import Sidebar from "./components/layout/sidebar";
import MobileNav from "./components/layout/mobile-nav";
import { useAuth, AuthProvider } from "./hooks/use-auth";

const AppContent = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Don't show layout on auth page
  if (location === "/auth") {
    return (
      <>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar (Desktop only) */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 pb-16 lg:pb-0">
          <Switch>
            <ProtectedRoute path="/" component={HomePage} />
            <ProtectedRoute path="/profile" component={ProfilePage} />
            <ProtectedRoute path="/discover" component={DiscoverPage} />
            <ProtectedRoute path="/messages" component={MessagesPage} />
            <ProtectedRoute path="/messages/:userId" component={MessagesPage} />
            <ProtectedRoute path="/admin" component={AdminPage} />
            <Route component={NotFound} />
          </Switch>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
