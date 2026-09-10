"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string | null;
  clientCompany: string | null;
  rating: number;
  message: string;
}

const fallback: Testimonial[] = [
  {
    id: "t1",
    clientName: "Sarah Mitchell",
    clientTitle: "CMO",
    clientCompany: "BrightPath SaaS",
    rating: 5,
    message:
      "Climbix rebuilt our entire growth system in 90 days. We went from 12 demos a month to 47 — without raising ad spend. Their AI-driven approach is genuinely different from any agency we've worked with.",
  },
  {
    id: "t2",
    clientName: "James Okonkwo",
    clientTitle: "Founder & CEO",
    clientCompany: "UrbanCart",
    rating: 5,
    message:
      "Our ROAS jumped from 2.1× to 4.7× in one quarter. The team treats our budget like their own money and the reporting is the most transparent I've seen in 8 years of e-commerce.",
  },
  {
    id: "t3",
    clientName: "Dr. Aisha Rahman",
    clientTitle: "Director",
    clientCompany: "MedVista Clinic",
    rating: 5,
    message:
      "We booked 38 new patient consultations in our first month with Climbix. Their automation workflows freed up two full-time roles on our team. Worth every penny.",
  },
];

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(fallback);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        if (d.testimonials && d.testimonials.length > 0) setItems(d.testimonials);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 mb-4">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Client Voices</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Trusted by Brands That Choose{" "}
            <span className="gradient-text">Growth Over Guesswork</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-600 leading-relaxed">
            Real words from real clients. We let the results speak.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <div
              key={t.id}
              className="card-hover bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-200" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed flex-1">
                "{t.message}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Avatar className="w-10 h-10 border border-slate-200">
                  <AvatarFallback className="gradient-bg text-white text-sm font-semibold">
                    {t.clientName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.clientName}</div>
                  <div className="text-xs text-slate-500">
                    {[t.clientTitle, t.clientCompany].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
