import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";
import { StyleSelector } from "./StyleSelector";
import { Sparkles, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GenerationWorkspaceProps {
  prompt: string;
  setPrompt: (p: string) => void;
  style: string;
  setStyle: (s: string) => void;
  uploadedImage: File | null;
  uploadPreview: string | null;
  onImageSelect: (file: File) => void;
  onClearImage: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generatedImage: string | null;
  onAbort: () => void;
  retryCount: number;
  retryLimit: number;
}


export function GenerationWorkspace({
  prompt,
  setPrompt,
  style,
  setStyle,
  uploadedImage,
  uploadPreview,
  onImageSelect,
  onClearImage,
  onGenerate,
  isGenerating,
  generatedImage,
  onAbort,
  retryCount,
  retryLimit,
}: GenerationWorkspaceProps) {

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt" className="text-base font-semibold mb-2 block">
            Prompt
          </Label>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate... e.g., 'A serene mountain landscape at sunset with purple skies'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-32 resize-none"
            disabled={isGenerating}
            data-testid="input-prompt"
          />
        </div>

        <div>
          <Label className="text-base font-semibold mb-2 block">
            Upload Reference Image (Optional)
          </Label>
          <ImageUpload
            onImageSelect={onImageSelect}
            selectedImage={uploadPreview}
            onClearImage={onClearImage}
          />
        </div>

        <div>
          <Label className="text-base font-semibold mb-2 block">
            Style
          </Label>
          <StyleSelector
            selectedStyle={style}
            onStyleChange={setStyle}
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim() || retryCount >= retryLimit}
          data-testid="button-generate"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              {retryCount < retryLimit ? "Generate" : "Retry limit reached"}
            </>
          )}
        </Button>
      </div>

      {(generatedImage || isGenerating) && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Result</h3>
            {isGenerating && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onAbort}
                data-testid="button-abort"
              >
                <X className="mr-2 h-4 w-4" />
                Abort
              </Button>
            )}
          </div>
          
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Creating your masterpiece...
                  </p>
                </div>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated result"
                className="w-full h-full object-contain"
                data-testid="img-generated"
              />
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
