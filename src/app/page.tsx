"use client";

import { useAppStore } from "@/lib/store";
import { PublicSite } from "@/components/site/public-site";
import { AdminLogin } from "@/components/admin/login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function Home() {
  const view = useAppStore((s) => s.view);
  const authed = useAppStore((s) => s.authed);

  if (view === "admin") {
    if (!authed) return <AdminLogin />;
    return <AdminDashboard />;
  }

  return <PublicSite />;
}
