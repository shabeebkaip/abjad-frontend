
import AboutHero from "./_components/AboutHero";
import PhotoStrip from "../_components/PhotoStrip";
import MissionSection from "./_components/MissionSection";
import VisionAndWhySection from "./_components/VisionAndWhySection";
import ValuesSection from "./_components/ValuesSection";
import TeamSection from "./_components/TeamSection";
import AboutCta from "./_components/AboutCta";
import LocalizedTitle from "../_components/LocalizedTitle";

export const metadata = {
  title: "About Abjad — Empowering Education Excellence Across Saudi Arabia",
  description:
    "Abjad connects teachers and substitute teachers with private national and private international schools across Saudi Arabia. Learn about our mission, vision, team and values.",
};

export default function AboutPage() {
  return (
    <>
      <LocalizedTitle page="about" />
      <AboutHero />
      <PhotoStrip photos={["femaleClassroom", "studentsWalking", "maleClassroom"]} />
      <MissionSection />
      <VisionAndWhySection />
      <ValuesSection />
      <TeamSection />
      <AboutCta />
    </>
  );
}
