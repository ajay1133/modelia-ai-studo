import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { authService, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthProps {
  onLogin: (username: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { toast } = useToast();

  const handleSubmit = async (username: string, password: string) => {
    try {
      if (mode === "signup") {
        const result = await authService.signup({ username, password });
        onLogin(result.user.username);
        toast({
          title: "Account created",
          description: "Welcome to Modelia AI Studio!",
        });
      } else {
        const result = await authService.login({ username, password });
        onLogin(result.user.username);
        toast({
          title: "Welcome back",
          description: `Signed in as ${result.user.username}`,
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: mode === "signup" ? "Signup failed" : "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AuthForm
      mode={mode}
      onSubmit={handleSubmit}
      onToggleMode={() => setMode(mode === "login" ? "signup" : "login")}
    />
  );
}
