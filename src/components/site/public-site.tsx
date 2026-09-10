"use client";

import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { Pillars } from "./pillars";
import { Problem } from "./problem";
import { Process } from "./process";
import { Services } from "./services";
import { CaseStudies } from "./case-studies";
import { Testimonials } from "./testimonials";
import { WhyChoose } from "./why-choose";
import { FAQ } from "./faq";
import { ContactCTA } from "./contact-cta";
import { Footer } from "./footer";
import { WhatsAppFloat } from "./whatsapp-float";

export function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Pillars />
        <Problem />
        <Process />
        <Services />
        <CaseStudies />
        <Testimonials />
        <WhyChoose />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
