import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Studio from "@/pages/Studio";
import NotFound from "@/pages/not-found";

function Router() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<string | null>(null);

  const handleGetStarted = () => {
    setLocation("/auth");
  };

  const handleLogin = (username: string) => {
    setUser(username);
    setLocation("/studio");
  };

  const handleLogout = () => {
    setUser(null);
    setLocation("/");
  };

  return (
    <Switch>
      <Route path="/">
        <Landing onGetStarted={handleGetStarted} />
      </Route>
      <Route path="/auth">
        <Auth onLogin={handleLogin} />
      </Route>
      <Route path="/studio">
        {user ? (
          <Studio username={user} onLogout={handleLogout} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
