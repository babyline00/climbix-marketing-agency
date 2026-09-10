"use client";

import { Brain, Layers, BarChart3, Users } from "lucide-react";

const items = [
  {
    icon: Brain,
    title: "AI-Driven Strategy",
    desc: "We use AI and data to build scalable growth strategies — not guesswork. Every recommendation is backed by performance data and predictive modeling.",
  },
  {
    icon: Layers,
    title: "End-to-End Services",
    desc: "Consulting, web dev, automation, and marketing under one roof. No juggling five vendors, no integration tax, no finger-pointing when results slip.",
  },
  {
    icon: BarChart3,
    title: "Measurable Growth",
    desc: "Every dollar tied to revenue. KPIs and ROI visible in real-time dashboards you can access 24/7 — full transparency, no black-box reporting.",
  },
  {
    icon: Users,
    title: "One Growth Partner",
    desc: "A dedicated strategist, engineer, and creative working as one team on your business. No account managers relaying messages — direct access to doers.",
  },
];

const pills = ["AI Powered", "End-to-End Services", "Digital Solutions", "Growth Focused", "Dedicated Partner"];

export function WhyChoose() {
  return (
    <section id="why" className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 mb-4">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Why Climbix</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Why Brands Choose{" "}
            <span className="gradient-text">Climbix</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            We're not another agency. We're your growth infrastructure partner — building systems that compound,
            not campaigns that vanish.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {pills.map((p) => (
              <span key={p} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-teal-500/20">
                <it.icon className="w-5 h-5 text-white" />
              </div>
              <h3
                className="text-lg font-bold text-slate-900"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {it.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
