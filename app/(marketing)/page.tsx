import HeroSection from "./home/_components/HeroSection";
import HowItWorksSection from "./home/_components/HowItWorksSection";
import FeaturesSection from "./home/_components/FeaturesSection";
import StatsSection from "./home/_components/StatsSection";
import TestimonialsSection from "./home/_components/TestimonialsSection";
import StartHiringSection from "./home/_components/StartHiringSection";
import { CtaBanner } from "./_components/CtaAndFooter";
import LocalizedTitle from "./_components/LocalizedTitle";

export default function HomePage() {
  return (
    <>
      <LocalizedTitle page="home" />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaBanner />
      <StartHiringSection />
    </>
  );
}
