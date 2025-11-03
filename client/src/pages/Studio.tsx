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
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryLimit = 3;
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
    
    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const loadHistory = async () => {
    try {
      const history = await generationService.getHistory();
      const mapped = history.map((gen) => ({
        id: gen.id,
        imageUrl: gen.imageUrl,
        prompt: gen.prompt,
        style: gen.style,
        timestamp: gen.createdAt,
      }));
      setGenerations(mapped);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleImageSelect = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setUploadPreview(null);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || retryCount >= retryLimit) return;
    
    // Clean up any existing abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setPendingGeneration({ prompt, style, image: uploadedImage });
    setIsGenerating(true);
    setGeneratedImage(null);
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;
    
    try {
      const result = await generationService.generate(
        prompt,
        style,
        uploadedImage,
        currentController.signal
      );
      setGeneratedImage(result.imageUrl);
      setIsGenerating(false);
      setRetryCount(0); // Reset retry count on success
      setPrompt("");
      setStyle("realistic");
      setUploadedImage(null);
      setUploadPreview(null);
      const newGeneration: UIGeneration = {
        id: result.id,
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        style: result.style,
        timestamp: result.createdAt,
      };
      setGenerations((prev) => [newGeneration, ...prev].slice(0, 5));
      toast({
        title: "Generation complete",
        description: "Your artwork has been created!",
      });
    } catch (error) {
      setIsGenerating(false);
      setRetryCount((prev) => prev + 1);
      if (retryCount + 1 >= retryLimit) {
        setPrompt("");
        setStyle("realistic");
        setUploadedImage(null);
        setUploadPreview(null);
        setRetryCount(0);
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        toast({
          title: "Generation aborted",
          description: "The generation was cancelled",
        });
        return;
      }
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        setShowError(true);
      } else {
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
      setIsGenerating(false); // Immediately update UI state
      toast({
        title: "Generation cancelled",
        description: "Image generation was cancelled",
      });
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
            prompt={prompt}
            setPrompt={setPrompt}
            style={style}
            setStyle={setStyle}
            uploadedImage={uploadedImage}
            uploadPreview={uploadPreview}
            onImageSelect={handleImageSelect}
            onClearImage={handleClearImage}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generatedImage={generatedImage}
            onAbort={handleAbort}
            retryCount={retryCount}
            retryLimit={retryLimit}
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
