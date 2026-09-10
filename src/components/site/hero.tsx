"use client";

import { useEffect, useRef } from "react";
import { Rocket, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dots: { x: number; y: number; r: number; vx: number; vy: number; c: string }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      dots.length = 0;
      const count = Math.min(60, Math.floor((w * h) / 9000));
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          c: Math.random() > 0.5 ? "rgba(46,196,182," : "rgba(56,189,248,",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // glow orbs
      const tealOrb = ctx.createRadialGradient(w * 0.75, h * 0.3, 0, w * 0.75, h * 0.3, w * 0.45);
      tealOrb.addColorStop(0, "rgba(46,196,182,0.22)");
      tealOrb.addColorStop(1, "rgba(46,196,182,0)");
      ctx.fillStyle = tealOrb;
      ctx.fillRect(0, 0, w, h);

      const blueOrb = ctx.createRadialGradient(w * 0.25, h * 0.7, 0, w * 0.25, h * 0.7, w * 0.4);
      blueOrb.addColorStop(0, "rgba(30,58,138,0.32)");
      blueOrb.addColorStop(1, "rgba(30,58,138,0)");
      ctx.fillStyle = blueOrb;
      ctx.fillRect(0, 0, w, h);

      // orbit rings
      ctx.strokeStyle = "rgba(46,196,182,0.18)";
      ctx.lineWidth = 1;
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(20, Math.min(w, h) * 0.12 * i), 0, Math.PI * 2);
        ctx.stroke();
      }

      // dots
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.fillStyle = d.c + "0.9)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // central rocket glow
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      centerGlow.addColorStop(0, "rgba(46,196,182,0.45)");
      centerGlow.addColorStop(0.4, "rgba(46,196,182,0.15)");
      centerGlow.addColorStop(1, "rgba(46,196,182,0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(cx - 80, cy - 80, 160, 160);

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      init();
    };

    resize();
    init();
    draw();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative hero-radial pt-[68px] overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
          {/* Copy */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card w-fit">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span className="text-xs font-semibold text-teal-200 tracking-wide uppercase">
                AI-Powered Growth Systems
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-bold text-white tracking-tight text-balance"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Build Smarter. Grow Faster. — Partner with an{" "}
              <span className="gradient-text">AI-Powered Marketing Agency</span> Driving Real Business Growth.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-[640px]">
              We help startups, SMEs, and enterprises accelerate revenue with AI-driven digital marketing,
              performance advertising, SEO, lead generation, and business automation — engineered as one
              connected growth system, not disconnected services.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => scrollTo("contact")}
                size="lg"
                className="gradient-bg text-white border-0 hover:opacity-90 shadow-xl shadow-teal-500/25 px-6 h-12 text-base"
              >
                Book a Free Strategy Call
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-card border-white/20 text-white hover:bg-white/10 hover:text-white px-6 h-12 text-base"
              >
                <a href="https://wa.me/15555550100?text=Hi%20Climbix%2C%20I%27d%20like%20a%20free%20website%20audit" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Free Website Audit
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Free Consultation
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                No Hidden Costs
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Results-Focused Approach
              </span>
            </div>
          </div>

          {/* Cosmos visual */}
          <div className="relative aspect-square max-w-[460px] mx-auto w-full">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-24 h-24 rounded-2xl gradient-bg-rich flex items-center justify-center shadow-2xl shadow-teal-500/40 animate-pulse-glow">
                <Rocket className="w-11 h-11 text-white" />
              </div>
            </div>
            {/* Orbiting badges */}
            <div className="absolute top-8 right-8 px-3 py-1.5 glass-card-strong rounded-lg text-xs text-white font-medium animate-float">
              +247% Revenue
            </div>
            <div className="absolute bottom-12 left-4 px-3 py-1.5 glass-card-strong rounded-lg text-xs text-white font-medium animate-float" style={{ animationDelay: "1.5s" }}>
              12,400+ Leads
            </div>
            <div className="absolute bottom-4 right-12 px-3 py-1.5 glass-card-strong rounded-lg text-xs text-white font-medium animate-float" style={{ animationDelay: "3s" }}>
              99.9% Uptime
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="border-t border-white/5 bg-[#050A14]/50">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {[
              { v: "12,400+", l: "Qualified Leads Generated" },
              { v: "48", l: "Active Growth Systems" },
              { v: "247%", l: "Avg Revenue Growth" },
              { v: "250+", l: "Projects Delivered" },
              { v: "1,800+", l: "AI Workflows Automated" },
            ].map((kpi, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div
                  className="text-2xl lg:text-3xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {kpi.v}
                </div>
                <div className="text-xs text-slate-400 leading-snug">{kpi.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
