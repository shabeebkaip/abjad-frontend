import type { Metadata } from "next";
import SchoolsHero from "./_components/SchoolsHero";
import SchoolsHiringChallenge from "./_components/SchoolsHiringChallenge";
import SchoolsSimpleHiring from "./_components/SchoolsSimpleHiring";
import SchoolsForEducators from "./_components/SchoolsForEducators";
import SchoolsTalentPool from "./_components/SchoolsTalentPool";
import SchoolsGrowth from "./_components/SchoolsGrowth";
import SchoolsDiscover from "./_components/SchoolsDiscover";
import SchoolsVsJobBoards from "./_components/SchoolsVsJobBoards";
import SchoolsFaq from "./_components/SchoolsFaq";
import SchoolsCta from "./_components/SchoolsCta";

export const metadata: Metadata = {
  title: "Hire Teachers in Saudi Arabia — Abjad for Schools",
  description:
    "Abjad is the easiest way to hire qualified teachers, substitute teachers, and educators for international, private, and national schools across Saudi Arabia. Post jobs and get matched instantly.",
};

export default function SchoolsPage() {
  return (
    <>
      <SchoolsHero />
      <SchoolsHiringChallenge />
      <SchoolsSimpleHiring />
      <SchoolsForEducators />
      <SchoolsTalentPool />
      <SchoolsGrowth />
      <SchoolsDiscover />
      <SchoolsVsJobBoards />
      <SchoolsFaq />
      <SchoolsCta />
    </>
  );
}
