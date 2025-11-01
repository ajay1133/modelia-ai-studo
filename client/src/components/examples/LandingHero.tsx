import { LandingHero } from "../LandingHero";

export default function LandingHeroExample() {
  return (
    <LandingHero 
      onGetStarted={() => console.log("Get started clicked")} 
    />
  );
}
