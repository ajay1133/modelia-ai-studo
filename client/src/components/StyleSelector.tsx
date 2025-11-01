import { Card } from "@/components/ui/card";

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {styles.map((style) => (
        <Card
          key={style.id}
          className={`
            p-4 cursor-pointer transition-all hover-elevate
            ${selectedStyle === style.id ? "border-2 border-primary" : ""}
          `}
          onClick={() => onStyleChange(style.id)}
          data-testid={`style-option-${style.id}`}
        >
          <h4 className="font-semibold mb-1">{style.name}</h4>
          <p className="text-xs text-muted-foreground">{style.description}</p>
        </Card>
      ))}
    </div>
  );
}
