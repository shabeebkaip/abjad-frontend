import type { Metadata } from "next";
import TeachersHero from "./_components/TeachersHero";
import TeachersHowItWorks from "./_components/TeachersHowItWorks";
import TeachersOpportunities from "./_components/TeachersOpportunities";
import TeachersForSchools from "./_components/TeachersForSchools";
import TeachersWhyChooseAbjad from "./_components/TeachersWhyChooseAbjad";
import TeachersNetwork from "./_components/TeachersNetwork";
import TeachersFaq from "./_components/TeachersFaq";
import TeachersCta from "./_components/TeachersCta";

export const metadata: Metadata = {
  title: "Teaching Jobs in Saudi Arabia — Find Schools with Abjad",
  description:
    "Abjad connects qualified teachers and substitute teachers with top international, private, and national schools across Saudi Arabia. Create a free profile and get matched instantly.",
};

export default function TeachersPage() {
  return (
    <>
      <TeachersHero />
      <TeachersHowItWorks />
      <TeachersOpportunities />
      <TeachersForSchools />
      <TeachersWhyChooseAbjad />
      <TeachersNetwork />
      <TeachersFaq />
      <TeachersCta />
    </>
  );
}
