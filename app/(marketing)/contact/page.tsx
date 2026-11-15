import type { Metadata } from "next";
import ContactHero from "./_components/ContactHero";
import WhyReachUs from "./_components/WhyReachUs";
import WhoShouldContact from "./_components/WhoShouldContact";
import HowItWorksProcess from "./_components/HowItWorksProcess";
import ContactForm from "./_components/ContactForm";
import ServingSchools from "./_components/ServingSchools";
import ContactFaq from "./_components/ContactFaq";
import LocalizedTitle from "../_components/LocalizedTitle";

export const metadata: Metadata = {
  title: "Contact Abjad — Hire Substitute Teachers for Riyadh, Jeddah & Dammam Schools",
  description:
    "Contact Abjad to hire qualified substitute teachers and permanent educators for private national and private international schools across Saudi Arabia.",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <LocalizedTitle page="contact" />
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
