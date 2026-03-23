
import AboutHero from "./_components/AboutHero";
import MissionSection from "./_components/MissionSection";
import VisionAndWhySection from "./_components/VisionAndWhySection";
import ValuesSection from "./_components/ValuesSection";
import TeamSection from "./_components/TeamSection";
import AboutCta from "./_components/AboutCta";

export const metadata = {
  title: "About Abjad — Empowering Education Excellence Across Saudi Arabia",
  description:
    "Abjad connects teachers, substitute teachers, and schools across Riyadh, Jeddah, and Dammam. Learn about our mission, vision, team, and values.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <VisionAndWhySection />
      <ValuesSection />
      <TeamSection />
      <AboutCta />
    </>
  );
}
