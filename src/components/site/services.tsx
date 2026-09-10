"use client";

import { useEffect, useState } from "react";
import {
  Megaphone, TrendingUp, Search, Target, Code, Zap, PenTool, ArrowRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  features?: string | null;
}

const iconMap: Record<string, any> = {
  Megaphone, TrendingUp, Search, Target, Code, Zap, PenTool
};

const fallbackServices: Service[] = [
  {
    id: "s1",
    title: "Performance Marketing",
    tagline: "Revenue acquisition systems",
    description: "AI-driven paid advertising across Google, Meta, LinkedIn, and TikTok. We optimize toward revenue, not clicks — every dollar tracked to a closed deal.",
    icon: "TrendingUp",
    features: JSON.stringify(["Google & Meta Ads", "AI bid optimization", "Multi-touch attribution", "Landing page CRO", "ROAS reporting"]),
  },
  {
    id: "s2",
    title: "SEO Services",
    tagline: "Predictable organic growth",
    description: "Technical, content, and authority SEO under one roof. We build compounding organic pipelines that reduce CAC over time.",
    icon: "Search",
    features: JSON.stringify(["Technical audits", "Keyword strategy", "Content production", "Link building", "Local SEO"]),
  },
  {
    id: "s3",
    title: "AI Automation",
    tagline: "Scale operations predictably",
    description: "Replace repetitive work with intelligent workflows. Connect your CRM, marketing, ops, and finance with automations that run 24/7.",
    icon: "Zap",
    features: JSON.stringify(["Workflow mapping", "AI automation", "CRM integration", "Lead routing", "Report automation"]),
  },
  {
    id: "s4",
    title: "Website Development",
    tagline: "Convert visitors into customers",
    description: "High-performance Next.js sites built to convert. Sub-second load times, A/B testing built in, analytics wired from day one.",
    icon: "Code",
    features: JSON.stringify(["Next.js development", "Conversion design", "Core Web Vitals", "A/B testing", "CMS integration"]),
  },
  {
    id: "s5",
    title: "High-Ticket Lead Gen",
    tagline: "Qualified opportunities, predictably",
    description: "AI-powered outbound + inbound systems that fill your pipeline with sales-ready leads using intent data and personalized sequences.",
    icon: "Target",
    features: JSON.stringify(["Intent data", "AI outreach", "Multi-channel sequences", "Lead scoring", "Meeting booking"]),
  },
  {
    id: "s6",
    title: "Content Marketing",
    tagline: "Visibility, trust, and revenue",
    description: "AI-assisted content engines producing SEO articles, social posts, and lead magnets at scale — every piece tied to a funnel stage.",
    icon: "PenTool",
    features: JSON.stringify(["Content strategy", "AI-assisted production", "SEO articles", "Lead magnets", "Funnel mapping"]),
  },
  {
    id: "s7",
    title: "Digital Marketing",
    tagline: "Every channel, one system",
    description: "Unify SEO, paid, content, and social into one data-driven engine. Full-funnel campaigns that compound month over month.",
    icon: "Megaphone",
    features: JSON.stringify(["Full-funnel strategy", "Cross-channel orchestration", "Audience segmentation", "Conversion tracking", "Weekly reporting"]),
  },
];

const badges = ["AI Powered", "Enterprise Ready", "End-to-End Services", "Growth Focused"];

export function Services() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        if (d.services && Array.isArray(d.services) && d.services.length > 0) {
          setServices(d.services);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="py-20 lg:py-24 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 mb-4">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Our Expertise</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            AI-Powered Services That{" "}
            <span className="gradient-text">Accelerate Growth</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            Seven connected services, one growth system. Each engineered to compound results and integrate
            seamlessly with the next — no more juggling disconnected vendors.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {badges.map((b) => (
              <Badge key={b} variant="secondary" className="bg-white text-slate-700 border border-slate-200">
                {b}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = iconMap[s.icon] || Megaphone;
            const features: string[] = s.features ? safeParse(s.features) : [];
            return (
              <div
                key={s.id}
                className="card-hover bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-teal-500/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                    {s.tagline}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-lg font-bold text-slate-900 mb-2"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.description}</p>
                  {features.length > 0 && (
                    <ul className="grid grid-cols-1 gap-1.5">
                      {features.slice(0, 4).map((f, j) => (
                        <li key={j} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-teal-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => scrollTo("contact")}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Explore Service
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => scrollTo("contact")}
            size="lg"
            className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-teal-500/25 px-6 h-12"
          >
            Ready to Accelerate Your Growth?
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="mt-3 text-xs text-slate-500">Free Consultation · No Hidden Costs · Results-Focused Approach</p>
        </div>
      </div>
    </section>
  );
}

function safeParse(s: string): string[] {
  try {
    return JSON.parse(s);
  } catch {
    return [];
  }
}
