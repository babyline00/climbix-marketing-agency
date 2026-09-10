"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Rocket, MessageCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";

const services = [
  { name: "Digital Marketing", tagline: "Every channel, one system", anchor: "services" },
  { name: "Performance Marketing", tagline: "Revenue acquisition systems", anchor: "services" },
  { name: "SEO Services", tagline: "Predictable organic growth", anchor: "services" },
  { name: "Lead Generation", tagline: "Qualified opportunities, predictably", anchor: "services" },
  { name: "Website Development", tagline: "Convert visitors into customers", anchor: "services" },
  { name: "Business Automation", tagline: "Scale operations predictably", anchor: "services" },
  { name: "Content Marketing", tagline: "Visibility, trust, and revenue", anchor: "services" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setView = useAppStore((s) => s.setView);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#050A14]/85 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Rocket className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-lg gradient-bg opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
                Climbix
              </span>
              <span className="text-teal-300 text-[10px] font-medium tracking-wider uppercase">
                Marketing Agency
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[420px] p-2 bg-white border border-slate-200 shadow-xl rounded-xl"
              >
                <div className="grid grid-cols-1 gap-1">
                  {services.map((s) => (
                    <DropdownMenuItem
                      key={s.name}
                      onClick={() => scrollTo("services")}
                      className="p-3 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{s.name}</span>
                        <span className="text-xs text-slate-500">{s.tagline}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={() => scrollTo("about")} className="px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollTo("process")} className="px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors">
              Process
            </button>
            <button onClick={() => scrollTo("case-studies")} className="px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors">
              Work
            </button>
            <button onClick={() => scrollTo("faq")} className="px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors">
              FAQ
            </button>
            <button onClick={() => scrollTo("contact")} className="px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors">
              Contact
            </button>
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              onClick={() => setView("admin")}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              Admin
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#25d366] hover:bg-[#1da851] text-white border-0"
            >
              <a href="https://wa.me/15555550100?text=Hi%20Climbix%2C%20I%27d%20like%20a%20free%20website%20audit" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Free Audit
              </a>
            </Button>
            <Button
              onClick={() => scrollTo("contact")}
              size="sm"
              className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-teal-500/25"
            >
              Book Strategy Call
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#050A14]/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
            <button onClick={() => scrollTo("services")} className="text-left px-4 py-3 text-white/85 hover:bg-white/5 rounded-lg font-medium">Services</button>
            <button onClick={() => scrollTo("about")} className="text-left px-4 py-3 text-white/85 hover:bg-white/5 rounded-lg font-medium">About</button>
            <button onClick={() => scrollTo("process")} className="text-left px-4 py-3 text-white/85 hover:bg-white/5 rounded-lg font-medium">Process</button>
            <button onClick={() => scrollTo("case-studies")} className="text-left px-4 py-3 text-white/85 hover:bg-white/5 rounded-lg font-medium">Work</button>
            <button onClick={() => scrollTo("faq")} className="text-left px-4 py-3 text-white/85 hover:bg-white/5 rounded-lg font-medium">FAQ</button>
            <button onClick={() => scrollTo("contact")} className="text-left px-4 py-3 text-white/85 hover:bg-white/5 rounded-lg font-medium">Contact</button>
            <button onClick={() => { setMobileOpen(false); setView("admin"); }} className="text-left px-4 py-3 text-teal-300 hover:bg-white/5 rounded-lg font-medium">Admin Dashboard</button>
            <div className="flex flex-col gap-2 mt-2">
              <Button asChild className="bg-[#25d366] hover:bg-[#1da851] text-white border-0">
                <a href="https://wa.me/15555550100" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Free Audit
                </a>
              </Button>
              <Button onClick={() => scrollTo("contact")} className="gradient-bg text-white border-0">
                Book Strategy Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
