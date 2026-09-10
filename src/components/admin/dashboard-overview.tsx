"use client";

import { useEffect, useState } from "react";
import {
  Users, Target, FolderKanban, DollarSign, TrendingUp, TrendingDown,
  Mail, Star, Activity, ArrowUpRight, Calendar
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  stats: {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    wonLeads: number;
    activeClients: number;
    activeProjects: number;
    totalServices: number;
    testimonials: number;
    caseStudies: number;
    unreadMessages: number;
    mrr: number;
    totalRevenue: number;
  };
  charts: {
    leadsBySource: { name: string; value: number }[];
    leadsByStatus: { name: string; value: number }[];
    projectsByStatus: { name: string; value: number }[];
    monthlyTrend: { name: string; leads: number; revenue: number }[];
  };
  recent: {
    leads: any[];
    projects: any[];
  };
}

const PIE_COLORS = ["#1e3a8a", "#2ec4b6", "#38bdf8", "#a855f7", "#f97316", "#10b981"];
const STATUS_COLORS: Record<string, string> = {
  new: "#38bdf8",
  contacted: "#a855f7",
  qualified: "#2ec4b6",
  won: "#10b981",
  lost: "#ef4444",
};

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  const { stats, charts, recent } = data;
  const formatMoney = (n: number) => "$" + n.toLocaleString();

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatMoney(stats.totalRevenue),
      change: "+24.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "MRR",
      value: formatMoney(stats.mrr),
      change: "+12.3%",
      trend: "up",
      icon: TrendingUp,
      color: "from-teal-500 to-teal-700",
    },
    {
      label: "Total Leads",
      value: stats.totalLeads.toString(),
      change: "+18.2%",
      trend: "up",
      icon: Target,
      color: "from-purple-500 to-purple-700",
    },
    {
      label: "Active Clients",
      value: stats.activeClients.toString(),
      change: "+2",
      trend: "up",
      icon: Users,
      color: "from-orange-500 to-orange-700",
    },
  ];

  const secondaryCards = [
    { label: "New Leads", value: stats.newLeads, icon: Target, color: "text-blue-600" },
    { label: "Qualified", value: stats.qualifiedLeads, icon: Star, color: "text-teal-600" },
    { label: "Won Deals", value: stats.wonLeads, icon: TrendingUp, color: "text-emerald-600" },
    { label: "Active Projects", value: stats.activeProjects, icon: FolderKanban, color: "text-purple-600" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: Mail, color: "text-orange-600" },
    { label: "Services", value: stats.totalServices, icon: Activity, color: "text-blue-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back. Here's what's happening across your agency.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Primary KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden border-slate-200 shadow-sm">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.color}`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {kpi.label}
                </CardDescription>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-md`}>
                  <kpi.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${kpi.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {secondaryCards.map((s, i) => (
          <Card key={i} className="border-slate-200 shadow-sm">
            <CardContent className="py-4 px-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
                {s.value}
              </div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Monthly trend - takes 2 cols */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
              Leads & Revenue Trend
            </CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.monthlyTrend}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ec4b6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2ec4b6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  fill="url(#leadGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#2ec4b6"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads by status pie */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
              Leads by Status
            </CardTitle>
            <CardDescription>Pipeline distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.leadsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {charts.leadsByStatus.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
              Leads by Source
            </CardTitle>
            <CardDescription>Where your leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.leadsBySource} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#64748b" }} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" name="Leads" radius={[0, 6, 6, 0]}>
                  {charts.leadsBySource.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
              Projects by Status
            </CardTitle>
            <CardDescription>Active project pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.projectsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]}>
                  {charts.projectsByStatus.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
              Recent Leads
            </CardTitle>
            <CardDescription>Latest prospects from your funnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recent.leads.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No leads yet</p>
              ) : (
                recent.leads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {lead.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{lead.name}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {lead.company || lead.email}
                        {lead.service && ` · ${lead.service}`}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] capitalize shrink-0"
                      style={{
                        color: STATUS_COLORS[lead.status] || "#64748b",
                        borderColor: STATUS_COLORS[lead.status] || "#cbd5e1",
                      }}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-sora)" }}>
              Recent Projects
            </CardTitle>
            <CardDescription>Active work in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recent.projects.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No projects yet</p>
              ) : (
                recent.projects.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{p.title}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {p.client?.company || "Unknown client"} · {p.service}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-xs font-semibold text-slate-700">{p.progress}%</div>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                        style={{
                          color: STATUS_COLORS[p.status] || "#64748b",
                          borderColor: STATUS_COLORS[p.status] || "#cbd5e1",
                        }}
                      >
                        {p.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
