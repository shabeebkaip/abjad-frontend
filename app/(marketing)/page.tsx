import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import FeaturesSection from "./_components/FeaturesSection";
import StatsSection from "./_components/StatsSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import StartHiringSection from "./_components/StartHiringSection";
import { CtaBanner, Footer } from "./_components/CtaAndFooter";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaBanner />
      <StartHiringSection />
      <Footer />
    </>
  );
}
