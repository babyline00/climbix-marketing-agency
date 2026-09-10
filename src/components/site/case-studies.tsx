"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Star, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  clientName: string;
  challenge: string;
  result: string;
  metric1Label: string | null;
  metric1Value: string | null;
  metric2Label: string | null;
  metric2Value: string | null;
  metric3Label: string | null;
  metric3Value: string | null;
}

const fallback: CaseStudy[] = [
  {
    id: "c1",
    title: "B2B SaaS: From 12 to 47 Demos/Month",
    category: "B2B SaaS",
    clientName: "BrightPath",
    challenge: "Strong product, leaky funnel. Slow site, lead forms unworked for 48 hours, no intent visibility.",
    result: "Rebuilt site on Next.js, automated lead routing with AI scoring, layered multi-touch outbound sequence. 4× demo growth at the same ad budget.",
    metric1Label: "Demos / month",
    metric1Value: "12 → 47",
    metric2Label: "CAC reduction",
    metric2Value: "-43%",
    metric3Label: "Site load time",
    metric3Value: "3.4s → 0.9s",
  },
  {
    id: "c2",
    title: "E-commerce: 4.7× ROAS in 90 Days",
    category: "E-commerce",
    clientName: "UrbanCart",
    challenge: "Burning budget on broad audiences with no attribution clarity. 2.1× ROAS but no path to scale.",
    result: "Restructured campaigns with AI bid optimization, shipped 18 new landing pages, built multi-touch attribution model. ROAS scaled to 4.7×.",
    metric1Label: "ROAS",
    metric1Value: "2.1× → 4.7×",
    metric2Label: "Revenue lift",
    metric2Value: "+247%",
    metric3Label: "Conversion rate",
    metric3Value: "1.8% → 4.2%",
  },
  {
    id: "c3",
    title: "Healthcare: 38 New Patient Consultations",
    category: "Healthcare",
    clientName: "MedVista",
    challenge: "Relied on word-of-mouth. No online booking, no review strategy, no channel measurement.",
    result: "Launched conversion-optimized site, automated booking reminders, ran hyper-local SEO + ads campaign. 38 consultations booked in month one.",
    metric1Label: "Monthly bookings",
    metric1Value: "0 → 38",
    metric2Label: "Google rating",
    metric2Value: "3.9 → 4.8",
    metric3Label: "Hours saved / week",
    metric3Value: "32 hrs",
  },
];

export function CaseStudies() {
  const [cases, setCases] = useState<CaseStudy[]>(fallback);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((d) => {
        if (d.caseStudies && d.caseStudies.length > 0) setCases(d.caseStudies);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="case-studies" className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-4">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Success Stories</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Backed by <span className="gradient-text">Real Results</span>, Not Promises
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            We measure success in revenue, not vanity metrics. Here are three brands that trusted Climbix to
            engineer their growth system.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {cases.map((c) => (
            <div
              key={c.id}
              className="card-hover bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
            >
              {/* header */}
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-semibold text-teal-700 uppercase tracking-wide">
                    {c.category}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <h3
                  className="text-lg font-bold text-slate-900 leading-tight"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Client: {c.clientName}</p>
              </div>

              {/* body */}
              <div className="p-6 pt-4 flex flex-col gap-3 flex-1">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-red-500 mb-1">Challenge</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.challenge}</p>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-teal-600 mb-1">Result</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.result}</p>
                </div>

                {/* metrics */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
                  {[
                    { l: c.metric1Label, v: c.metric1Value },
                    { l: c.metric2Label, v: c.metric2Value },
                    { l: c.metric3Label, v: c.metric3Value },
                  ].map((m, i) => m.v ? (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="text-sm font-bold gradient-text leading-tight">{m.v}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{m.l}</div>
                    </div>
                  ) : null)}
                </div>
              </div>

              <div className="px-6 pb-5">
                <button
                  onClick={() => scrollTo("contact")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  View Case Study
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA card */}
        <div className="mt-12 relative overflow-hidden rounded-2xl gradient-bg-rich p-8 lg:p-12 text-center text-white shadow-2xl shadow-teal-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32 blur-2xl" />
          <div className="relative flex flex-col items-center gap-4">
            <Quote className="w-10 h-10 text-white/80" />
            <h3
              className="text-2xl lg:text-3xl font-bold leading-tight max-w-2xl"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Ready to Become Our Next Success Story?
            </h3>
            <p className="text-white/90 max-w-xl">
              Book a free strategy call and we'll map the exact growth system that fits your business — no fluff, no obligation.
            </p>
            <Button
              onClick={() => scrollTo("contact")}
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/90 px-6 h-12 border-0"
            >
              Book Your Free Strategy Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
