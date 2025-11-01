import { GenerationHistory, Generation } from "../GenerationHistory";
import exampleImage1 from "@assets/generated_images/Example_generation_1_d7c4356f.png";
import exampleImage2 from "@assets/generated_images/Example_generation_2_f76f043e.png";
import exampleImage3 from "@assets/generated_images/Example_generation_3_fd5c446a.png";

const mockGenerations: Generation[] = [
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
    prompt: "Abstract flowing liquid metal forms in purple",
    style: "abstract",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
];

export default function GenerationHistoryExample() {
  return (
    <div className="p-8 max-w-md">
      <GenerationHistory
        generations={mockGenerations}
        onSelectGeneration={(gen) => console.log("Selected:", gen)}
      />
    </div>
  );
}
