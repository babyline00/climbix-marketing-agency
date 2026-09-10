import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      activeClients,
      activeProjects,
      totalServices,
      testimonials,
      caseStudies,
      unreadMessages,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "new" } }),
      db.lead.count({ where: { status: "qualified" } }),
      db.lead.count({ where: { status: "won" } }),
      db.client.count({ where: { status: "active" } }),
      db.project.count({ where: { status: "in_progress" } }),
      db.service.count({ where: { active: true } }),
      db.testimonial.count({ where: { active: true } }),
      db.caseStudy.count(),
      db.contactMessage.count({ where: { read: false } }),
    ]);

    // Leads by source
    const leadsBySourceRaw = await db.lead.groupBy({
      by: ["source"],
      _count: { _all: true },
    });
    const leadsBySource = leadsBySourceRaw.map((s) => ({
      name: s.source || "unknown",
      value: s._count._all,
    }));

    // Leads by status
    const leadsByStatusRaw = await db.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const leadsByStatus = leadsByStatusRaw.map((s) => ({
      name: s.status,
      value: s._count._all,
    }));

    // Projects by status
    const projectsByStatusRaw = await db.project.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const projectsByStatus = projectsByStatusRaw.map((s) => ({
      name: s.status,
      value: s._count._all,
    }));

    // Recent leads
    const recentLeads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Recent projects
    const recentProjects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    });

    // MRR (Monthly Recurring Revenue)
    const clients = await db.client.findMany({ where: { status: "active" } });
    const mrr = clients.reduce((sum, c) => sum + (c.monthlyFee || 0), 0);

    // Revenue from won leads (mock average deal size * won count)
    const avgDealSize = 4500;
    const totalRevenue = wonLeads * avgDealSize;

    // Generate monthly trend (last 6 months from leads)
    const now = new Date();
    const months: { name: string; leads: number; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await db.lead.count({
        where: { createdAt: { gte: d, lt: end } },
      });
      months.push({
        name: d.toLocaleString("en-US", { month: "short" }),
        leads: count,
        revenue: count * avgDealSize * 0.3,
      });
    }

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        wonLeads,
        activeClients,
        activeProjects,
        totalServices,
        testimonials,
        caseStudies,
        unreadMessages,
        mrr,
        totalRevenue,
      },
      charts: {
        leadsBySource,
        leadsByStatus,
        projectsByStatus,
        monthlyTrend: months,
      },
      recent: {
        leads: recentLeads,
        projects: recentProjects,
      },
    });
  } catch (e: any) {
    console.error("Dashboard error:", e);
    return NextResponse.json({ error: e?.message || "Failed to fetch dashboard" }, { status: 500 });
  }
}
