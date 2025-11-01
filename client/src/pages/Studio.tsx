import { useState, useEffect, useRef } from "react";
import { AppHeader } from "@/components/AppHeader";
import { GenerationWorkspace } from "@/components/GenerationWorkspace";
import { GenerationHistory, Generation as UIGeneration } from "@/components/GenerationHistory";
import { ErrorModal } from "@/components/ErrorModal";
import { generationService, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface StudioProps {
  username: string;
  onLogout: () => void;
}

export default function Studio({ username, onLogout }: StudioProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingGeneration, setPendingGeneration] = useState<{
    prompt: string;
    style: string;
    image: File | null;
  } | null>(null);
  const [generations, setGenerations] = useState<UIGeneration[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await generationService.getHistory();
      const mapped = history.map((gen) => ({
        id: gen.id,
        imageUrl: gen.imageUrl,
        prompt: gen.prompt,
        style: gen.style,
        timestamp: new Date(gen.createdAt),
      }));
      setGenerations(mapped);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleGenerate = async (prompt: string, style: string, image: File | null) => {
    setPendingGeneration({ prompt, style, image });
    setIsGenerating(true);
    setGeneratedImage(null);

    abortControllerRef.current = new AbortController();

    try {
      const result = await generationService.generate(
        prompt,
        style,
        image,
        abortControllerRef.current.signal
      );

      setGeneratedImage(result.imageUrl);
      setIsGenerating(false);

      const newGeneration: UIGeneration = {
        id: result.id,
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        style: result.style,
        timestamp: new Date(result.createdAt),
      };

      setGenerations((prev) => [newGeneration, ...prev].slice(0, 5));

      toast({
        title: "Generation complete",
        description: "Your artwork has been created!",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setIsGenerating(false);
        toast({
          title: "Generation aborted",
          description: "The generation was cancelled",
        });
        return;
      }

      if (error instanceof ApiError) {
        setIsGenerating(false);
        setErrorMessage(error.message);
        setShowError(true);
      } else {
        setIsGenerating(false);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    setShowError(false);
    if (pendingGeneration) {
      handleGenerate(
        pendingGeneration.prompt,
        pendingGeneration.style,
        pendingGeneration.image
      );
    }
  };

  const handleSelectGeneration = (generation: UIGeneration) => {
    setGeneratedImage(generation.imageUrl);
    toast({
      title: "Generation restored",
      description: "Previous work loaded in workspace",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username={username} onLogout={onLogout} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 p-6">
        <div>
          <GenerationWorkspace
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generatedImage={generatedImage}
            onAbort={handleAbort}
          />
        </div>

        <aside>
          <GenerationHistory
            generations={generations}
            onSelectGeneration={handleSelectGeneration}
          />
        </aside>
      </div>

      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        onRetry={handleRetry}
        message={errorMessage}
      />
    </div>
  );
}
