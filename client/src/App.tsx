import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DiscoveryPage from "@/pages/discovery-page";
import MessagesPage from "@/pages/messages-page";
import ProfilePage from "@/pages/profile-page";
import AdminPage from "@/pages/admin-page";
import { useAuth } from "./hooks/use-auth";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function Router() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <div className="flex-grow">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/discovery" component={DiscoveryPage} />
          <ProtectedRoute path="/messages" component={MessagesPage} />
          <ProtectedRoute path="/profile/:id" component={ProfilePage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
