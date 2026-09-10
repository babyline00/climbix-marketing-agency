"use client";

import { Search, Compass, Wrench, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Discover & Strategize",
    desc: "We analyze your goals, tech stack, customer journey, and competitive landscape — then map a revenue-first growth system tailored to your business.",
    bullets: ["Goal & KPI alignment", "Tech stack audit", "Journey mapping", "Opportunity analysis"],
  },
  {
    num: "02",
    icon: Compass,
    title: "Build Intelligent Solutions",
    desc: "We design and ship conversion-optimized websites, AI-powered campaigns, and automation workflows — built to compound month over month.",
    bullets: ["Conversion-focused web", "AI ad campaigns", "Automation blueprints", "Content engines"],
  },
  {
    num: "03",
    icon: Wrench,
    title: "Integrate, Automate & Optimize",
    desc: "We connect your website, CRM, marketing, and ops into one intelligent system — eliminating manual work and unlocking real-time insight.",
    bullets: ["CRM + marketing sync", "AI lead routing", "Workflow automation", "Real-time dashboards"],
  },
  {
    num: "04",
    icon: BarChart3,
    title: "Measure, Scale & Grow",
    desc: "We track every dollar to revenue, surface KPIs in real time, and continuously optimize toward higher ROAS, lower CAC, and faster scaling.",
    bullets: ["Multi-touch attribution", "Live KPI dashboards", "Continuous A/B testing", "Scaling playbooks"],
  },
];

export function Process() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="process" className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-4">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">How We Work</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Turn Business Challenges into{" "}
            <span className="gradient-text">Sustainable Growth</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            A proven 4-step framework that transforms scattered marketing effort into a connected growth system
            engineered for measurable, predictable revenue.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute -top-2 -right-2 text-7xl font-black text-slate-100 select-none" style={{ fontFamily: "var(--font-sora)" }}>
                {s.num}
              </div>
              <div className="relative w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-teal-500/20">
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative">
                <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Step {s.num}</div>
                <h3
                  className="text-lg font-bold text-slate-900 mb-2"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.desc}</p>
                <ul className="flex flex-col gap-1.5">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-teal-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => scrollTo("services")}
            size="lg"
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 h-12"
          >
            Explore Our AI-Powered Growth Systems
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
