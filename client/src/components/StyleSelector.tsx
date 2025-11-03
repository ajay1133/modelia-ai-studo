import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const styles: StyleOption[] = [
  { id: "realistic", name: "Realistic", description: "Photo-realistic style" },
  { id: "artistic", name: "Artistic", description: "Painterly and creative" },
  { id: "abstract", name: "Abstract", description: "Modern and abstract" },
  { id: "cyberpunk", name: "Cyberpunk", description: "Futuristic neon aesthetic" },
];

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <Select value={selectedStyle} onValueChange={onStyleChange}>
      <SelectTrigger className="w-full" data-testid="style-dropdown">
        <SelectValue placeholder="Select style" />
      </SelectTrigger>
      <SelectContent>
        {styles.map((style) => (
          <SelectItem key={style.id} value={style.id} data-testid={`style-option-${style.id}`}>
            <div>
              <div className="font-semibold">{style.name}</div>
              <div className="text-xs text-muted-foreground">{style.description}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
