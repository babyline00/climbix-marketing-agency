"use client";

import { Rocket, Linkedin, Instagram, Facebook, MessageCircle, ArrowUp } from "lucide-react";
import { useAppStore } from "@/lib/store";

const services = [
  "Digital Marketing",
  "Performance Marketing",
  "SEO Services",
  "Business Automation",
  "Website Development",
  "Lead Generation",
  "Content Marketing",
];

export function Footer() {
  const setView = useAppStore((s) => s.setView);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-[#050A14] border-t border-white/10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-8 lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-sora)" }}>
                  Climbix
                </span>
                <span className="text-teal-300 text-[10px] font-medium tracking-wider uppercase">
                  Marketing Agency
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              We help startups, SMEs, and enterprises accelerate growth with AI-powered digital marketing,
              business automation, and intelligent growth systems designed to increase revenue, streamline
              operations, and build sustainable competitive advantage.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: MessageCircle, href: "https://wa.me/15555550100" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-300 hover:text-teal-300 hover:border-teal-400/40 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-sora)" }}>
              Services
            </h4>
            <ul className="flex flex-col gap-2">
              {services.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo("services")}
                    className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-sora)" }}>
              Company
            </h4>
            <ul className="flex flex-col gap-2">
              <li><button onClick={() => scrollTo("about")} className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left">About</button></li>
              <li><button onClick={() => scrollTo("process")} className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left">Process</button></li>
              <li><button onClick={() => scrollTo("case-studies")} className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left">Case Studies</button></li>
              <li><button onClick={() => scrollTo("faq")} className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left">FAQ</button></li>
              <li><button onClick={() => scrollTo("contact")} className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left">Contact</button></li>
              <li><button onClick={() => setView("admin")} className="text-sm text-slate-400 hover:text-teal-300 transition-colors text-left">Admin Login</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-sora)" }}>
              Start a Conversation
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a href="mailto:hello@climbix.agency" className="text-slate-400 hover:text-teal-300 transition-colors">
                  hello@climbix.agency
                </a>
              </li>
              <li>
                <a href="tel:+15555550100" className="text-slate-400 hover:text-teal-300 transition-colors">
                  +1 (555) 555-0100
                </a>
              </li>
              <li className="text-slate-400">San Francisco, CA</li>
              <li className="text-slate-400">Mon – Sat · 9AM – 7PM PT</li>
            </ul>
            <button
              onClick={() => scrollTo("contact")}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
            >
              Book Strategy Call
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 Climbix Marketing Agency — Growth Infrastructure Partner.{" "}
            <span className="text-slate-400">Systems &gt; Services · Predictable Growth · Full-Stack Execution</span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
