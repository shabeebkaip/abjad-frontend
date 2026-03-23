import type { Metadata } from "next";
import ContactHero from "./_components/ContactHero";
import WhyReachUs from "./_components/WhyReachUs";
import WhoShouldContact from "./_components/WhoShouldContact";
import HowItWorksProcess from "./_components/HowItWorksProcess";
import ContactForm from "./_components/ContactForm";
import ServingSchools from "./_components/ServingSchools";
import ContactFaq from "./_components/ContactFaq";

export const metadata: Metadata = {
  title: "Contact Abjad — Hire Substitute Teachers for Riyadh, Jeddah & Dammam Schools",
  description:
    "Reach out to Abjad to connect with qualified substitute teachers and permanent educators for international and private schools across Saudi Arabia. Fast response, verified placements.",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <ContactHero />
      <WhyReachUs />
      <WhoShouldContact />
      <HowItWorksProcess />
      <ContactForm />
      <ServingSchools />
      <ContactFaq />
    </div>
  );
}
