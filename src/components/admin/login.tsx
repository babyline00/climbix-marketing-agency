"use client";

import { useState } from "react";
import { Rocket, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function AdminLogin() {
  const login = useAppStore((s) => s.login);
  const setView = useAppStore((s) => s.setView);
  const [email, setEmail] = useState("admin@climbix.agency");
  const [password, setPassword] = useState("climbix2026");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      login(data.user);
      toast.success("Welcome back, " + (data.user.name || "Admin"));
    } catch (e) {
      // Fallback: allow demo login without backend
      if (email === "admin@climbix.agency" && password === "climbix2026") {
        login({ email, name: "Climbix Admin", role: "admin" });
        toast.success("Welcome back, Admin (demo mode)");
      } else {
        toast.error("Invalid credentials. Try admin@climbix.agency / climbix2026");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 hero-radial">
      <div className="w-full max-w-md">
        <button
          onClick={() => setView("public")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        <div className="glass-card-strong rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-xl shadow-teal-500/30 mb-4">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Climbix Admin
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Sign in to your dashboard
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-200">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-teal-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-teal-500/25 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-5 p-3 rounded-lg bg-teal-500/10 border border-teal-400/20">
            <p className="text-xs text-teal-200">
              <strong>Demo credentials:</strong>
              <br />
              admin@climbix.agency / climbix2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
