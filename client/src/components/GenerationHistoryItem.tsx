import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface GenerationHistoryItemProps {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: Date;
  onClick: () => void;
}

export function GenerationHistoryItem({ 
  imageUrl, 
  prompt, 
  timestamp, 
  onClick 
}: GenerationHistoryItemProps) {
  return (
    <Card 
      className="p-3 cursor-pointer hover-elevate transition-all"
      onClick={onClick}
      data-testid="card-history-item"
    >
      <div className="aspect-square rounded-md overflow-hidden mb-3">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm font-medium line-clamp-2 mb-2" title={prompt}>
        {prompt}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatDistanceToNow(timestamp, { addSuffix: true })}
      </p>
    </Card>
  );
}
