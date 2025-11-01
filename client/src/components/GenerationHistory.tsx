import { Card } from "@/components/ui/card";
import { GenerationHistoryItem } from "./GenerationHistoryItem";
import { History } from "lucide-react";

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  timestamp: Date;
}

interface GenerationHistoryProps {
  generations: Generation[];
  onSelectGeneration: (generation: Generation) => void;
}

export function GenerationHistory({ generations, onSelectGeneration }: GenerationHistoryProps) {
  if (generations.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No generations yet</h3>
          <p className="text-sm text-muted-foreground">
            Your recent creations will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <History className="h-5 w-5" />
        Recent Generations
      </h3>
      
      <div className="space-y-4">
        {generations.map((generation) => (
          <GenerationHistoryItem
            key={generation.id}
            id={generation.id}
            imageUrl={generation.imageUrl}
            prompt={generation.prompt}
            timestamp={generation.timestamp}
            onClick={() => onSelectGeneration(generation)}
          />
        ))}
      </div>
    </div>
  );
}
