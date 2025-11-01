import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { GenerationWorkspace } from "@/components/GenerationWorkspace";
import { GenerationHistory, Generation } from "@/components/GenerationHistory";
import { ErrorModal } from "@/components/ErrorModal";
import exampleImage1 from "@assets/generated_images/Example_generation_1_d7c4356f.png";
import exampleImage2 from "@assets/generated_images/Example_generation_2_f76f043e.png";
import exampleImage3 from "@assets/generated_images/Example_generation_3_fd5c446a.png";
import exampleImage4 from "@assets/generated_images/Example_generation_4_c15915e6.png";
import exampleImage5 from "@assets/generated_images/Example_generation_5_61b7a8b1.png";

interface StudioProps {
  username: string;
  onLogout: () => void;
}

const mockImages = [exampleImage1, exampleImage2, exampleImage3, exampleImage4, exampleImage5];

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
  
  const [generations, setGenerations] = useState<Generation[]>([
    {
      id: "1",
      imageUrl: exampleImage1,
      prompt: "A serene mountain landscape at sunset with purple skies",
      style: "realistic",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      imageUrl: exampleImage2,
      prompt: "Futuristic cyberpunk city with neon lights",
      style: "cyberpunk",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      imageUrl: exampleImage3,
      prompt: "Abstract flowing liquid metal forms in purple and silver",
      style: "abstract",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ]);

  const simulateGeneration = (prompt: string, style: string, image: File | null) => {
    setIsGenerating(true);
    setGeneratedImage(null);

    const shouldFail = Math.random() < 0.2;

    setTimeout(() => {
      if (shouldFail) {
        setIsGenerating(false);
        setErrorMessage(
          "Our AI models are currently experiencing high demand. Please try again in a moment."
        );
        setShowError(true);
      } else {
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
        setGeneratedImage(randomImage);
        setIsGenerating(false);

        const newGeneration: Generation = {
          id: Date.now().toString(),
          imageUrl: randomImage,
          prompt,
          style,
          timestamp: new Date(),
        };

        setGenerations((prev) => [newGeneration, ...prev].slice(0, 5));
      }
    }, 3000);
  };

  const handleGenerate = (prompt: string, style: string, image: File | null) => {
    setPendingGeneration({ prompt, style, image });
    simulateGeneration(prompt, style, image);
  };

  const handleAbort = () => {
    setIsGenerating(false);
    console.log("Generation aborted");
  };

  const handleRetry = () => {
    setShowError(false);
    if (pendingGeneration) {
      simulateGeneration(
        pendingGeneration.prompt,
        pendingGeneration.style,
        pendingGeneration.image
      );
    }
  };

  const handleSelectGeneration = (generation: Generation) => {
    console.log("Selected generation:", generation);
    setGeneratedImage(generation.imageUrl);
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
