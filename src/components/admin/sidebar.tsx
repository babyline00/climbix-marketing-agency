"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, FolderKanban, Target, Star, Mail, Settings,
  Rocket, LogOut, Menu, X, ExternalLink, Bell, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

export type AdminTab =
  | "dashboard"
  | "leads"
  | "clients"
  | "projects"
  | "services"
  | "case-studies"
  | "testimonials"
  | "blog"
  | "messages"
  | "settings";

interface SidebarProps {
  active: AdminTab;
  setActive: (t: AdminTab) => void;
  unreadCount: number;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const navItems: { id: AdminTab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Target },
  { id: "clients", label: "Clients", icon: Users },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "services", label: "Services", icon: Settings },
  { id: "case-studies", label: "Case Studies", icon: FolderKanban },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "blog", label: "Blog Posts", icon: BookOpen },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

function SidebarContent({ active, setActive, unreadCount, setMobileOpen }: Omit<SidebarProps, "mobileOpen">) {
  const logout = useAppStore((s) => s.logout);
  const setView = useAppStore((s) => s.setView);
  const user = useAppStore((s) => s.user);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <button
          onClick={() => setView("public")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none text-left">
            <span className="text-white font-bold text-base" style={{ fontFamily: "var(--font-sora)" }}>
              Climbix
            </span>
            <span className="text-teal-300 text-[9px] font-medium tracking-wider uppercase">
              Admin Console
            </span>
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/30 to-teal-500/20 text-white border border-teal-400/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "messages" && unreadCount > 0 && (
                  <Badge className="bg-teal-500 text-white text-[10px] px-1.5 py-0 h-5 min-w-[20px] flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User + actions */}
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
        <button
          onClick={() => setView("public")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Public Site
        </button>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
            {(user?.name || "A").split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ active, setActive, unreadCount }: Omit<SidebarProps, "mobileOpen" | "setMobileOpen">) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[#050A14]/95 backdrop-blur-xl border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)} className="text-white p-1.5">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md gradient-bg flex items-center justify-center">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-sora)" }}>
            Climbix Admin
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-white p-1.5 hover:bg-white/10">
          <Bell className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-[#050A14] border-r border-white/10 h-screen sticky top-0">
        <SidebarContent
          active={active}
          setActive={setActive}
          unreadCount={unreadCount}
          setMobileOpen={setMobileOpen}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#050A14] border-r border-white/10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1.5 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              active={active}
              setActive={setActive}
              unreadCount={unreadCount}
              setMobileOpen={setMobileOpen}
            />
          </aside>
        </div>
      )}
    </>
  );
}
