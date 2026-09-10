"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exactly does Climbix do?",
    a: "Climbix is an AI-powered marketing agency that builds connected growth systems. We combine digital marketing, performance advertising, SEO, lead generation, web development, and business automation into one integrated engine — engineered to drive measurable revenue growth for startups, SMEs, and enterprises.",
  },
  {
    q: "How is Climbix different from a traditional marketing agency?",
    a: "Traditional agencies sell services in silos — SEO here, paid there, content somewhere else. Climbix builds systems: every channel is connected, every workflow is automated where it should be, and every dollar is tracked to revenue. We treat your business as one growth infrastructure, not a list of channels.",
  },
  {
    q: "What industries does Climbix work with?",
    a: "We work across B2B SaaS, e-commerce, healthcare, fintech, professional services, education, real estate, manufacturing, and consumer brands. Our AI-driven approach adapts to your ICP, sales motion, and growth stage — whether you're pre-revenue or scaling past $50M ARR.",
  },
  {
    q: "What services does Climbix provide?",
    a: "Seven core services under one roof: Digital Marketing (full-funnel), Performance Marketing (paid ads), SEO Services, High-Ticket Lead Generation, Website Development, Business Automation, and Content Marketing. Each is engineered to integrate with the others — no disconnected vendors.",
  },
  {
    q: "Why should I choose an AI-powered marketing agency?",
    a: "AI lets us optimize campaigns in real time, surface intent signals humans miss, automate repetitive ops work, and predict which strategies will compound. The result: faster scaling, lower CAC, and growth systems that improve month over month without linearly increasing headcount or ad spend.",
  },
  {
    q: "Do you work only with businesses in specific regions?",
    a: "No — we work with brands globally. While our home market is North America and Europe, we have active clients across APAC, MENA, and Latin America. Our playbooks are designed to adapt to local channels, languages, and buyer behavior.",
  },
  {
    q: "Can Climbix manage both technology and marketing?",
    a: "Yes. That's the core differentiator. We build the website, wire up the CRM, automate the ops, run the ads, write the content, and report on revenue — all in one connected stack. You get one team, one roadmap, one accountability partner for your entire growth infrastructure.",
  },
  {
    q: "How do we get started with Climbix?",
    a: "Book a free strategy call. We'll spend 45 minutes understanding your goals, audit your current stack and funnel, and map the exact growth system that fits your business. No pitch deck, no obligation — just a concrete plan you can execute with us or in-house.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-24 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-4">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Questions</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            Everything you need to know about working with Climbix. Still curious? Book a free call.
          </p>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 [&[data-state=open]]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
