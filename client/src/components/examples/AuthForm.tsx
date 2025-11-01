import { AuthForm } from "../AuthForm";
import { useState } from "react";

export default function AuthFormExample() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <AuthForm
      mode={mode}
      onSubmit={(username, password) => 
        console.log("Auth submitted:", { username, password })
      }
      onToggleMode={() => setMode(mode === "login" ? "signup" : "login")}
    />
  );
}
