import { FeatureCard } from "../FeatureCard";
import { Zap, Shield, Sparkles } from "lucide-react";

export default function FeatureCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      <FeatureCard
        icon={Zap}
        title="Lightning Fast"
        description="Generate stunning AI art in seconds with our optimized processing pipeline"
      />
      <FeatureCard
        icon={Shield}
        title="Secure & Private"
        description="Your creations and data are protected with enterprise-grade security"
      />
      <FeatureCard
        icon={Sparkles}
        title="Advanced AI"
        description="Powered by cutting-edge AI models for professional-quality results"
      />
    </div>
  );
}
