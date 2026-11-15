import type { Metadata } from "next";
import SchoolsHero from "./_components/SchoolsHero";
import PhotoStrip from "../_components/PhotoStrip";
import SchoolsHiringChallenge from "./_components/SchoolsHiringChallenge";
import SchoolsSimpleHiring from "./_components/SchoolsSimpleHiring";
import SchoolsForEducators from "./_components/SchoolsForEducators";
import SchoolsTalentPool from "./_components/SchoolsTalentPool";
import SchoolsGrowth from "./_components/SchoolsGrowth";
import SchoolsDiscover from "./_components/SchoolsDiscover";
import SchoolsVsJobBoards from "./_components/SchoolsVsJobBoards";
import SchoolsFaq from "./_components/SchoolsFaq";
import SchoolsCta from "./_components/SchoolsCta";
import LocalizedTitle from "../_components/LocalizedTitle";

export const metadata: Metadata = {
  title: "Hire Teachers in Saudi Arabia — Abjad for Schools",
  description:
    "Hire qualified teachers, substitute teachers and educators for private national and private international schools across Saudi Arabia. Post jobs and see best-matched candidates.",
};

export default function SchoolsPage() {
  return (
    <>
      <LocalizedTitle page="schools" />
      <SchoolsHero />
      <PhotoStrip photos={["artClass", "maleClassroom", "scienceLab"]} />
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
