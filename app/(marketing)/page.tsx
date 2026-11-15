import HeroSection from "./home/_components/HeroSection";
import PathsSection from "./home/_components/PathsSection";
import WhySection from "./home/_components/WhySection";
import HomeFaq from "./home/_components/HomeFaq";
import FinalCta from "./home/_components/FinalCta";
import LocalizedTitle from "./_components/LocalizedTitle";

export default function HomePage() {
  return (
    <>
      <LocalizedTitle page="home" />
      <HeroSection />
      <PathsSection />
      <WhySection />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
