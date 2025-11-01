import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";

interface AuthProps {
  onLogin: (username: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleSubmit = (username: string, password: string) => {
    console.log("Auth submitted:", { mode, username, password });
    onLogin(username);
  };

  return (
    <AuthForm
      mode={mode}
      onSubmit={handleSubmit}
      onToggleMode={() => setMode(mode === "login" ? "signup" : "login")}
    />
  );
}
