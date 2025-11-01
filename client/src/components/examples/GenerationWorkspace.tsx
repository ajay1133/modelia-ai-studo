import { GenerationWorkspace } from "../GenerationWorkspace";
import { useState } from "react";

export default function GenerationWorkspaceExample() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = (prompt: string, style: string, image: File | null) => {
    console.log("Generate:", { prompt, style, hasImage: !!image });
    setIsGenerating(true);
    setGeneratedImage(null);
    
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImage("https://placehold.co/800x800/8b5cf6/white?text=Generated+Art");
    }, 2000);
  };

  return (
    <div className="p-8 max-w-3xl">
      <GenerationWorkspace
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        generatedImage={generatedImage}
        onAbort={() => {
          setIsGenerating(false);
          console.log("Aborted");
        }}
      />
    </div>
  );
}
