"use client";

import { Brain, Layers, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Brain,
    title: "AI-Powered Marketing",
    desc: "Intelligent, scalable, and future-ready. Every campaign is optimized by AI models trained on your data.",
  },
  {
    icon: Layers,
    title: "Full-Funnel Systems",
    desc: "Custom solutions for real business impact — from first touch to closed revenue, all under one roof.",
  },
  {
    icon: Zap,
    title: "Automation & Process",
    desc: "Automate, streamline, and scale operations with AI workflows that run 24/7 without manual oversight.",
  },
  {
    icon: TrendingUp,
    title: "Measurable Growth",
    desc: "Integrated systems for sustainable growth — every dollar tracked to revenue, every KPI visible in real time.",
  },
];

export function Pillars() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="py-16 lg:py-20 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3"
            >
              <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-teal-500/20">
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <h3
                className="text-lg font-bold text-slate-900 leading-tight"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {p.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center text-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => scrollTo("contact")}
              size="lg"
              className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-teal-500/25 px-6 h-12"
            >
              Book a Free Strategy Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 h-12"
            >
              <a href="https://wa.me/15555550100" target="_blank" rel="noopener noreferrer">
                Get Free Website Audit
              </a>
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Free Consultation · No Hidden Costs · Results-Focused Approach
          </p>
        </div>
      </div>
    </section>
  );
}
