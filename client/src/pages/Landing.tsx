import { LandingHero } from "@/components/LandingHero";
import { FeatureCard } from "@/components/FeatureCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, Zap, Shield, History, Palette, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import exampleImage1 from "@assets/generated_images/Example_generation_1_d7c4356f.png";
import exampleImage2 from "@assets/generated_images/Example_generation_2_f76f043e.png";
import exampleImage3 from "@assets/generated_images/Example_generation_3_fd5c446a.png";
import exampleImage4 from "@assets/generated_images/Example_generation_4_c15915e6.png";
import exampleImage5 from "@assets/generated_images/Example_generation_5_61b7a8b1.png";

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AI Studio</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-16">
        <LandingHero onGetStarted={onGetStarted} />

        <section className="py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create stunning AI-generated artwork
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                icon={Palette}
                title="Multiple Styles"
                description="Choose from realistic, artistic, abstract, and cyberpunk styles"
              />
              <FeatureCard
                icon={History}
                title="Generation History"
                description="Access your last 5 creations instantly and restore previous work"
              />
              <FeatureCard
                icon={Download}
                title="High Quality Output"
                description="Download your creations in full resolution for any use"
              />
              <FeatureCard
                icon={Sparkles}
                title="Advanced AI"
                description="Powered by cutting-edge AI models for professional-quality results"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Example Creations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See what you can create with AI Studio
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[exampleImage1, exampleImage2, exampleImage3, exampleImage4, exampleImage5].map((img, i) => (
                <div 
                  key={i} 
                  className="aspect-square rounded-lg overflow-hidden hover-elevate transition-transform"
                >
                  <img
                    src={img}
                    alt={`Example ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Create Amazing Art?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators using AI Studio to bring their ideas to life
            </p>
            <Button 
              size="lg" 
              className="px-8"
              onClick={onGetStarted}
              data-testid="button-cta-bottom"
            >
              Get Started Free
            </Button>
          </div>
        </section>

        <footer className="border-t py-12 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>© 2025 AI Studio. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
