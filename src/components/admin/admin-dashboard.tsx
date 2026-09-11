"use client";

import { useEffect, useState } from "react";
import { AdminSidebar, AdminTab } from "./sidebar";
import { DashboardOverview } from "./dashboard-overview";
import { LeadsManager } from "./leads-manager";
import { ClientsManager } from "./clients-manager";
import { ProjectsManager } from "./projects-manager";
import { ServicesManager } from "./services-manager";
import { CaseStudiesManager } from "./case-studies-manager";
import { TestimonialsManager } from "./testimonials-manager";
import { BlogManager } from "./blog-manager";
import { MessagesManager } from "./messages-manager";
import { SettingsManager } from "./settings-manager";

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Poll unread messages count
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/contact");
        const d = await res.json();
        const unread = (d.messages || []).filter((m: any) => !m.read).length;
        setUnreadCount(unread);
      } catch {}
    };
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar active={tab} setActive={setTab} unreadCount={unreadCount} />
      <main className="flex-1 min-w-0 lg:h-screen lg:overflow-y-auto pt-14 lg:pt-0">
        {tab === "dashboard" && <DashboardOverview />}
        {tab === "leads" && <LeadsManager />}
        {tab === "clients" && <ClientsManager />}
        {tab === "projects" && <ProjectsManager />}
        {tab === "services" && <ServicesManager />}
        {tab === "case-studies" && <CaseStudiesManager />}
        {tab === "testimonials" && <TestimonialsManager />}
        {tab === "blog" && <BlogManager />}
        {tab === "messages" && <MessagesManager />}
        {tab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}
