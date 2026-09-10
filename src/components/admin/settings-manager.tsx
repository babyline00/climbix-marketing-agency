"use client";

import { useState } from "react";
import {
  User, Mail, Lock, Bell, Globe, Palette, Shield, Save, Rocket
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function SettingsManager() {
  const user = useAppStore((s) => s.user);
  const [profile, setProfile] = useState({
    name: user?.name || "Climbix Admin",
    email: user?.email || "admin@climbix.agency",
  });
  const [notifications, setNotifications] = useState({
    newLeads: true,
    newMessages: true,
    projectUpdates: true,
    weeklyReport: true,
    marketingEmails: false,
  });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and agency preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-sora)" }}>
              <User className="w-4 h-4 text-teal-600" />
              Profile
            </CardTitle>
            <CardDescription>Your personal account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-500/30">
                  {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <Button type="submit" size="sm" className="gradient-bg text-white border-0 hover:opacity-90 w-fit">
                <Save className="w-4 h-4 mr-1.5" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-sora)" }}>
              <Shield className="w-4 h-4 text-teal-600" />
              Security
            </CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" size="sm" variant="outline" className="w-fit">
                <Lock className="w-4 h-4 mr-1.5" />
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-sora)" }}>
              <Bell className="w-4 h-4 text-teal-600" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates you want to receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { key: "newLeads", label: "New leads", desc: "Get notified when a new lead is captured" },
                { key: "newMessages", label: "New messages", desc: "Contact form submissions from website" },
                { key: "projectUpdates", label: "Project updates", desc: "Status changes on tracked projects" },
                { key: "weeklyReport", label: "Weekly report", desc: "Summary of agency KPIs every Monday" },
                { key: "marketingEmails", label: "Marketing emails", desc: "Product news and feature updates" },
              ].map((n) => (
                <div key={n.key} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{n.label}</div>
                    <div className="text-xs text-slate-500">{n.desc}</div>
                  </div>
                  <Switch
                    checked={notifications[n.key as keyof typeof notifications]}
                    onCheckedChange={(v) => {
                      setNotifications((p) => ({ ...p, [n.key]: v }));
                      toast.success(`${n.label}: ${v ? "On" : "Off"}`);
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agency info */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-sora)" }}>
              <Rocket className="w-4 h-4 text-teal-600" />
              Agency Info
            </CardTitle>
            <CardDescription>Public-facing agency details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); toast.success("Agency info saved"); }}>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Agency Name</Label>
                <Input defaultValue="Climbix Marketing Agency" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Public Email</Label>
                <Input type="email" defaultValue="hello@climbix.agency" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">Phone</Label>
                <Input defaultValue="+1 (555) 555-0100" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-700">WhatsApp</Label>
                <Input defaultValue="15555550100" />
              </div>
              <Button type="submit" size="sm" className="gradient-bg text-white border-0 hover:opacity-90 w-fit">
                <Save className="w-4 h-4 mr-1.5" />
                Save Agency Info
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
