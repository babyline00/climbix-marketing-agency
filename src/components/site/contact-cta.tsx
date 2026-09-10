"use client";

import { useState } from "react";
import { Rocket, MessageCircle, Check, ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function ContactCTA() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      // Create lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "website" }),
      });
      // Create contact message
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.service ? `Inquiry: ${form.service}` : "Strategy call request",
          message: form.message,
        }),
      });
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm({ name: "", email: "", company: "", phone: "", service: "", budget: "", message: "" });
    } catch (e: any) {
      toast.error("Failed to send. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-24 relative overflow-hidden bg-[#050A14]">
      {/* glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Left: CTA copy */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card w-fit">
              <Rocket className="w-3.5 h-3.5 text-teal-300" />
              <span className="text-xs font-semibold text-teal-200 tracking-wide uppercase">
                Ready to Grow?
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Build the Digital Infrastructure Your Business Needs to{" "}
              <span className="gradient-text">Scale</span>
            </h2>

            <p className="text-base lg:text-lg text-slate-300 leading-relaxed max-w-[520px]">
              Book a free strategy call and walk away with a concrete growth roadmap tailored to your business —
              no pitch deck, no obligation, no fluff. Just a clear plan to accelerate revenue.
            </p>

            {/* trust stats */}
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { v: "500+", l: "Workflows Automated" },
                { v: "99.9%", l: "System Uptime" },
                { v: "-35%", l: "IT Costs Reduced" },
              ].map((s, i) => (
                <div key={i} className="glass-card rounded-xl p-4">
                  <div className="text-xl lg:text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-sora)" }}>
                    {s.v}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>

            {/* checklist */}
            <div className="flex flex-col gap-2">
              {[
                "Free Growth Consultation",
                "Custom Business Roadmap",
                "Response Within 24 Hours",
              ].map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
                    <Check className="w-3 h-3 text-teal-300" />
                  </span>
                  {c}
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-[#25d366] hover:bg-[#1da851] text-white border-0 px-6 h-12 w-fit"
            >
              <a href="https://wa.me/15555550100?text=Hi%20Climbix%2C%20I%27d%20like%20a%20free%20website%20audit" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Or Chat With Us on WhatsApp
              </a>
            </Button>
          </div>

          {/* Right: form */}
          <div className="glass-card-strong rounded-2xl p-6 lg:p-8">
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-200">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-200">
                    Work Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="company" className="text-xs font-semibold text-slate-200">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Acme Inc."
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-200">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+1 555 000 0000"
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-slate-200">Service Interest</Label>
                  <Select value={form.service} onValueChange={(v) => update("service", v)}>
                    <SelectTrigger className="bg-white/5 border-white/15 text-white focus:border-teal-400">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Performance Marketing">Performance Marketing</SelectItem>
                      <SelectItem value="SEO Services">SEO Services</SelectItem>
                      <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                      <SelectItem value="Website Development">Website Development</SelectItem>
                      <SelectItem value="Business Automation">Business Automation</SelectItem>
                      <SelectItem value="Content Marketing">Content Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-slate-200">Monthly Budget</Label>
                  <Select value={form.budget} onValueChange={(v) => update("budget", v)}>
                    <SelectTrigger className="bg-white/5 border-white/15 text-white focus:border-teal-400">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<$5k">&lt; $5k / month</SelectItem>
                      <SelectItem value="$5k–$10k">$5k – $10k / month</SelectItem>
                      <SelectItem value="$10k–$25k">$10k – $25k / month</SelectItem>
                      <SelectItem value="$25k+">$25k+ / month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message" className="text-xs font-semibold text-slate-200">
                  Tell us about your growth goals *
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="We're a Series A SaaS looking to scale paid + SEO. Currently at $2M ARR..."
                  required
                  rows={4}
                  className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="gradient-bg-rich text-white border-0 hover:opacity-90 shadow-xl shadow-teal-500/25 px-6 h-12 mt-2"
              >
                {submitting ? "Sending..." : "Book Your Free Strategy Call"}
                {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              <p className="text-[11px] text-slate-400 text-center">
                By submitting you agree to be contacted about your inquiry. We respond within 24 hours.
              </p>
            </form>
          </div>
        </div>

        {/* Contact details strip */}
        <div className="mt-12 pt-8 border-t border-white/10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Mail, label: "Email", v: "hello@climbix.agency", href: "mailto:hello@climbix.agency" },
            { icon: Phone, label: "Phone", v: "+1 (555) 555-0100", href: "tel:+15555550100" },
            { icon: MapPin, label: "Location", v: "San Francisco, CA · Remote-first" },
            { icon: Clock, label: "Hours", v: "Mon – Sat · 9AM – 7PM PT" },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center shrink-0">
                <c.icon className="w-4 h-4 text-teal-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">{c.label}</span>
                {c.href ? (
                  <a href={c.href} className="text-sm text-slate-200 hover:text-teal-300 transition-colors">
                    {c.v}
                  </a>
                ) : (
                  <span className="text-sm text-slate-200">{c.v}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
