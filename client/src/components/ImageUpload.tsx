import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
  onClearImage: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClearImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Validate type
    const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const isPng = file.type === 'image/png';
    if (!isJpg && !isPng) {
      setErrorMessage('Only JPG or PNG files are allowed');
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      setErrorMessage('File is too large — maximum allowed size is 10MB');
      return;
    }

    setErrorMessage(null);
    onImageSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const isPng = file.type === 'image/png';
    if (!isJpg && !isPng) {
      setErrorMessage('Only JPG or PNG files are allowed');
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrorMessage('File is too large — maximum allowed size is 10MB');
      return;
    }

    setErrorMessage(null);
    onImageSelect(file);
  };

  if (selectedImage) {
    return (
      <div className="relative group">
        <img
          src={selectedImage}
          alt="Selected upload"
          className="w-full h-64 object-cover rounded-lg"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onClearImage}
          data-testid="button-clear-image"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-8 min-h-64 flex flex-col items-center justify-center
        transition-colors cursor-pointer hover-elevate
        ${isDragging ? "border-primary bg-primary/5" : "border-border"}
      `}
      data-testid="dropzone-upload"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        data-testid="input-file"
      />
      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-base font-medium mb-2">
        Drop your image here or click to browse
      </p>
      <p className="text-sm text-muted-foreground">
        PNG, JPG, or GIF up to 10MB
      </p>
      {errorMessage && (
        <p data-testid="upload-error" className="text-sm text-destructive mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
