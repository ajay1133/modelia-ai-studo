import { ErrorModal } from "../ErrorModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Show Error Modal</Button>
      <ErrorModal
        open={open}
        onClose={() => setOpen(false)}
        onRetry={() => {
          console.log("Retry clicked");
          setOpen(false);
        }}
        message="Our AI models are currently experiencing high demand. Please try again in a moment."
      />
    </div>
  );
}
