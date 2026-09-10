"use client";

import { Unplug, Map, Repeat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: Unplug,
    title: "Disconnected Marketing",
    challenge: "Tools don't talk to each other. Ads, CRM, analytics, and content live in separate silos.",
    impact: "Missed leads, manual work, no single source of truth.",
    fix: "AI-powered integration layer that connects every channel and tool.",
  },
  {
    icon: Map,
    title: "Growth Without Strategy",
    challenge: "Spending on ads, SEO, and content without a unified roadmap or revenue target.",
    impact: "High cost, low ROI, and no predictable pipeline.",
    fix: "Strategic growth consulting tied to measurable KPIs and revenue outcomes.",
  },
  {
    icon: Repeat,
    title: "Scaling With Manual Processes",
    challenge: "Teams spend hours on repetitive tasks instead of strategic, revenue-generating work.",
    impact: "Low productivity, slow response times, missed opportunities.",
    fix: "AI automation that handles routing, reporting, and follow-ups 24/7.",
  },
];

export function Problem() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="about" className="py-20 lg:py-24" style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f7fbfd 50%, #edf9f6 100%)" }}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 mb-4">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">The Problem</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Marketing Isn't the Problem. The{" "}
            <span className="gradient-text">Missing Growth Strategy</span> Is.
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            Most businesses don't need more tools — they need a system. A connected, intelligent infrastructure
            that turns fragmented effort into predictable, measurable revenue.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-red-500" />
              </div>
              <h3
                className="text-xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {p.title}
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Challenge</div>
                  <p className="text-slate-700">{p.challenge}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-1">Business Impact</div>
                  <p className="text-slate-700">{p.impact}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-1">Our Approach</div>
                  <p className="text-slate-700">{p.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-center">
          <blockquote className="text-xl lg:text-2xl font-medium text-slate-800 leading-relaxed italic" style={{ fontFamily: "var(--font-sora)" }}>
            “Business growth doesn't come from adding more tools. It comes from building intelligent systems
            that connect your people, processes, and technology.”
          </blockquote>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Button
              onClick={() => scrollTo("contact")}
              size="lg"
              className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-teal-500/25 px-6 h-12"
            >
              Build the Right System for Your Business
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-slate-500">Free Consultation · No Hidden Costs · Results-Focused Approach</p>
          </div>
        </div>
      </div>
    </section>
  );
}
