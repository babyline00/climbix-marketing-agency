// scripts/seed.ts — Seed Climbix database with initial data
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding Climbix database...");

  // Admin user
  const existingAdmin = await db.user.findUnique({ where: { email: "admin@climbix.agency" } });
  if (!existingAdmin) {
    await db.user.create({
      data: {
        email: "admin@climbix.agency",
        password: "climbix2026",
        name: "Climbix Admin",
        role: "admin",
      },
    });
    console.log("Created admin user: admin@climbix.agency / climbix2026");
  }

  // Services
  const services = [
    {
      title: "Digital Marketing",
      slug: "digital-marketing",
      tagline: "Every channel, one system",
      description:
        "Unify SEO, paid, content, and social into a single data-driven engine. We orchestrate full-funnel campaigns that compound month over month — turning fragmented efforts into one predictable growth system.",
      icon: "Megaphone",
      features: JSON.stringify(["Full-funnel strategy", "Cross-channel orchestration", "Audience segmentation", "Conversion tracking", "Weekly reporting", "Dedicated strategist"]),
      order: 1,
    },
    {
      title: "Performance Marketing",
      slug: "performance-marketing",
      tagline: "Revenue acquisition systems",
      description:
        "AI-driven paid advertising across Google, Meta, LinkedIn, and TikTok. We optimize toward revenue, not clicks — every dollar is tracked to a closed deal with multi-touch attribution.",
      icon: "TrendingUp",
      features: JSON.stringify(["Google & Meta Ads", "LinkedIn & TikTok", "AI bid optimization", "Multi-touch attribution", "Landing page CRO", "ROAS reporting"]),
      order: 2,
    },
    {
      title: "SEO Services",
      slug: "seo-services",
      tagline: "Predictable organic growth",
      description:
        "Technical, content, and authority SEO under one roof. We build compounding organic pipelines that reduce CAC over time and rank for the keywords your buyers actually search.",
      icon: "Search",
      features: JSON.stringify(["Technical audits", "Keyword strategy", "Content production", "Link building", "Local SEO", "Monthly rankings"]),
      order: 3,
    },
    {
      title: "High-Ticket Lead Gen",
      slug: "lead-generation",
      tagline: "Qualified opportunities, predictably",
      description:
        "AI-powered outbound + inbound systems that fill your pipeline with sales-ready leads. We layer intent data, personalized outreach, and qualifying sequences to book qualified meetings on autopilot.",
      icon: "Target",
      features: JSON.stringify(["Intent data", "AI outreach", "Multi-channel sequences", "Lead scoring", "Meeting booking", "CRM integration"]),
      order: 4,
    },
    {
      title: "Website Development",
      slug: "website-development",
      tagline: "Convert visitors into customers",
      description:
        "High-performance websites built to convert. We design and ship conversion-optimized Next.js sites with sub-second load times, A/B testing built in, and analytics wired from day one.",
      icon: "Code",
      features: JSON.stringify(["Next.js development", "Conversion design", "Core Web Vitals", "A/B testing", "CMS integration", "Analytics setup"]),
      order: 5,
    },
    {
      title: "Business Automation",
      slug: "business-automation",
      tagline: "Scale operations predictably",
      description:
        "Replace repetitive work with intelligent workflows. We connect your CRM, marketing, ops, and finance tools with AI automations that run 24/7 and eliminate manual bottlenecks.",
      icon: "Zap",
      features: JSON.stringify(["Workflow mapping", "AI automation", "CRM + ops integration", "Lead routing", "Report automation", "Process documentation"]),
      order: 6,
    },
    {
      title: "Content Marketing",
      slug: "content-marketing",
      tagline: "Visibility, trust, and revenue",
      description:
        "AI-assisted content engines that produce SEO-optimized articles, social posts, and lead magnets at scale — every piece tied to a funnel stage and a measurable outcome.",
      icon: "PenTool",
      features: JSON.stringify(["Content strategy", "AI-assisted production", "SEO articles", "Lead magnets", "Distribution", "Funnel mapping"]),
      order: 7,
    },
  ];

  for (const s of services) {
    const existing = await db.service.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      await db.service.create({ data: s as any });
      console.log(`Created service: ${s.title}`);
    }
  }

  // Testimonials
  const testimonials = [
    {
      clientName: "Sarah Mitchell",
      clientTitle: "CMO",
      clientCompany: "BrightPath SaaS",
      rating: 5,
      message:
        "Climbix rebuilt our entire growth system in 90 days. We went from 12 demos a month to 47 — without raising ad spend. Their AI-driven approach is genuinely different from any agency we've worked with.",
    },
    {
      clientName: "James Okonkwo",
      clientTitle: "Founder & CEO",
      clientCompany: "UrbanCart",
      rating: 5,
      message:
        "Our ROAS jumped from 2.1× to 4.7× in one quarter. The team treats our budget like their own money and the reporting is the most transparent I've seen in 8 years of e-commerce.",
    },
    {
      clientName: "Dr. Aisha Rahman",
      clientTitle: "Director",
      clientCompany: "MedVista Clinic",
      rating: 5,
      message:
        "We booked 38 new patient consultations in our first month with Climbix. Their automation workflows freed up two full-time roles on our team. Worth every penny.",
    },
    {
      clientName: "Marcus Lindqvist",
      clientTitle: "VP Marketing",
      clientCompany: "Northpeak B2B",
      rating: 5,
      message:
        "The lead gen system they built qualified out 70% of our noise. We finally talk to prospects who actually have budget and intent. Our sales team has never been happier.",
    },
    {
      clientName: "Priya Nair",
      clientTitle: "Head of Growth",
      clientCompany: "FinEdge",
      rating: 5,
      message:
        "Climbix automated our entire onboarding flow and lead routing. What took our ops team 14 hours a week now takes 20 minutes. The ROI was visible in week three.",
    },
    {
      clientName: "David Chen",
      clientTitle: "Co-founder",
      clientCompany: "LoopCommerce",
      rating: 5,
      message:
        "Their SEO content engine produced 142 ranked articles in 6 months — bringing in 38,000 monthly organic visitors. We now rank #1 for our category's primary keyword.",
    },
  ];

  for (const t of testimonials) {
    await db.testimonial.upsert({
      where: { id: `seed-t-${t.clientName.replace(/\s+/g, "-").toLowerCase()}` },
      update: {},
      create: { id: `seed-t-${t.clientName.replace(/\s+/g, "-").toLowerCase()}`, ...t },
    });
  }
  console.log(`Upserted ${testimonials.length} testimonials`);

  // Case studies
  const caseStudies = [
    {
      title: "B2B SaaS: From 12 to 47 Demos/Month",
      category: "B2B SaaS",
      clientName: "BrightPath",
      challenge:
        "BrightPath had a strong product but a leaky funnel. Paid ads sent traffic to a slow site, lead forms went unworked for 48 hours, and sales had no visibility into intent signals.",
      result:
        "We rebuilt their site on Next.js, automated lead routing with AI scoring, and layered a multi-touch outbound sequence. Result: 4× demo growth at the same ad budget.",
      metric1Label: "Demos / month",
      metric1Value: "12 → 47",
      metric2Label: "CAC reduction",
      metric2Value: "-43%",
      metric3Label: "Site load time",
      metric3Value: "3.4s → 0.9s",
      featured: true,
    },
    {
      title: "E-commerce: 4.7× ROAS in 90 Days",
      category: "E-commerce",
      clientName: "UrbanCart",
      challenge:
        "UrbanCart was burning budget on broad audiences with no attribution clarity. Their Meta campaigns had a 2.1× ROAS but no path to scale without diluting margins.",
      result:
        "We restructured campaigns with AI bid optimization, shipped 18 new landing pages, and built a multi-touch attribution model. ROAS scaled to 4.7× while spend doubled.",
      metric1Label: "ROAS",
      metric1Value: "2.1× → 4.7×",
      metric2Label: "Revenue lift",
      metric2Value: "+247%",
      metric3Label: "Conversion rate",
      metric3Value: "1.8% → 4.2%",
      featured: true,
    },
    {
      title: "Healthcare: 38 New Patient Consultations",
      category: "Healthcare",
      clientName: "MedVista",
      challenge:
        "MedVista relied on word-of-mouth and outdated SEO. They had no online booking, no review strategy, and no way to measure which channels brought in paying patients.",
      result:
        "We launched a conversion-optimized site, automated booking reminders, and ran a hyper-local SEO + ads campaign. They booked 38 consultations in month one.",
      metric1Label: "Monthly bookings",
      metric1Value: "0 → 38",
      metric2Label: "Google rating",
      metric2Value: "3.9 → 4.8",
      metric3Label: "Hours saved / week",
      metric3Value: "32 hrs",
      featured: true,
    },
  ];

  for (const cs of caseStudies) {
    await db.caseStudy.upsert({
      where: { id: `seed-cs-${cs.clientName.toLowerCase()}` },
      update: {},
      create: { id: `seed-cs-${cs.clientName.toLowerCase()}`, ...cs },
    });
  }
  console.log(`Upserted ${caseStudies.length} case studies`);

  // Team
  const team = [
    { name: "Daniel Foster", role: "Founder & CEO", bio: "12 years scaling B2B and DTC brands. Ex-Google Ads strategist.", order: 1 },
    { name: "Elena Vasquez", role: "Head of Performance", bio: "Managed $40M+ in ad spend across SaaS, e-com, and healthcare.", order: 2 },
    { name: "Marcus Lee", role: "Head of SEO & Content", bio: "Built content engines that drove 8-figure organic revenue.", order: 3 },
    { name: "Aisha Khan", role: "Head of Automation", bio: "Architected 500+ AI workflows across CRM, ops, and finance.", order: 4 },
    { name: "Tom Bridger", role: "Lead Web Engineer", bio: "Ships conversion-optimized Next.js sites for enterprise clients.", order: 5 },
  ];

  for (const m of team) {
    await db.teamMember.upsert({
      where: { id: `seed-tm-${m.name.replace(/\s+/g, "-").toLowerCase()}` },
      update: {},
      create: { id: `seed-tm-${m.name.replace(/\s+/g, "-").toLowerCase()}`, ...m },
    });
  }
  console.log(`Upserted ${team.length} team members`);

  // Sample leads
  const leads = [
    { name: "Olivia Hart", email: "olivia@northpeak.io", phone: "+1 415 555 0142", company: "Northpeak", service: "Performance Marketing", budget: "$10k–$25k/mo", status: "new", source: "website" },
    { name: "Ravi Menon", email: "ravi@finedge.in", phone: "+91 98765 11234", company: "FinEdge", service: "Business Automation", budget: "$5k–$10k/mo", status: "contacted", source: "referral" },
    { name: "Emma Larsen", email: "emma@loopco.com", company: "LoopCommerce", service: "SEO Services", budget: "$10k–$25k/mo", status: "qualified", source: "ads" },
    { name: "Kwame Asante", email: "kwame@vantage.io", phone: "+44 20 7946 0331", company: "Vantage", service: "Lead Generation", budget: "$25k+/mo", status: "won", source: "website" },
    { name: "Sofia Rossi", email: "sofia@urbancart.it", phone: "+39 333 555 7788", company: "UrbanCart", service: "Digital Marketing", budget: "$25k+/mo", status: "won", source: "referral" },
    { name: "Liang Wei", email: "liang@nextech.cn", company: "NexTech", service: "Website Development", budget: "$5k–$10k/mo", status: "new", source: "ads" },
    { name: "Hassan Ali", email: "hassan@bizflow.ae", phone: "+971 50 555 2211", company: "BizFlow", service: "Business Automation", budget: "$10k–$25k/mo", status: "contacted", source: "whatsapp" },
    { name: "Grace Kim", email: "grace@brightpath.co", company: "BrightPath", service: "Lead Generation", budget: "$10k–$25k/mo", status: "qualified", source: "website" },
    { name: "Lucas Meyer", email: "lucas@stratos.de", phone: "+49 30 555 9920", company: "Stratos", service: "Performance Marketing", budget: "$25k+/mo", status: "won", source: "referral" },
    { name: "Maya Patel", email: "maya@medvista.health", company: "MedVista", service: "Digital Marketing", budget: "$10k–$25k/mo", status: "lost", source: "ads" },
  ];

  for (const l of leads) {
    await db.lead.create({ data: l });
  }
  console.log(`Created ${leads.length} sample leads`);

  // Sample clients
  const clients = [
    { name: "Sarah Mitchell", company: "BrightPath SaaS", email: "sarah@brightpath.co", phone: "+1 415 555 0192", website: "brightpath.co", industry: "SaaS", status: "active", monthlyFee: 18000 },
    { name: "James Okonkwo", company: "UrbanCart", email: "james@urbancart.it", phone: "+39 333 555 7788", website: "urbancart.it", industry: "E-commerce", status: "active", monthlyFee: 24000 },
    { name: "Dr. Aisha Rahman", company: "MedVista Clinic", email: "aisha@medvista.health", phone: "+1 212 555 0145", website: "medvista.health", industry: "Healthcare", status: "active", monthlyFee: 9500 },
    { name: "Marcus Lindqvist", company: "Northpeak B2B", email: "marcus@northpeak.io", phone: "+46 8 555 1234", website: "northpeak.io", industry: "B2B Services", status: "active", monthlyFee: 15000 },
    { name: "Priya Nair", company: "FinEdge", email: "priya@finedge.in", phone: "+91 98765 43210", website: "finedge.in", industry: "Fintech", status: "active", monthlyFee: 12000 },
    { name: "David Chen", company: "LoopCommerce", email: "david@loopco.com", phone: "+1 206 555 0177", website: "loopco.com", industry: "E-commerce", status: "paused", monthlyFee: 8000 },
  ];

  for (const c of clients) {
    await db.client.create({ data: c });
  }
  console.log(`Created ${clients.length} sample clients`);

  // Sample projects
  const sampleClients = await db.client.findMany();
  const projectsData = [
    { title: "Full-Funnel Growth System", service: "Digital Marketing", status: "in_progress", progress: 65, budget: 45000 },
    { title: "Meta + Google Ads Restructure", service: "Performance Marketing", status: "in_progress", progress: 40, budget: 28000 },
    { title: "Website Rebuild — Next.js", service: "Website Development", status: "review", progress: 90, budget: 32000 },
    { title: "Technical SEO Audit + Fixes", service: "SEO Services", status: "completed", progress: 100, budget: 12000 },
    { title: "AI Lead Routing Automation", service: "Business Automation", status: "in_progress", progress: 55, budget: 18500 },
    { title: "Content Engine — 60 Articles", service: "Content Marketing", status: "planning", progress: 15, budget: 22000 },
    { title: "Outbound Sequence — ICP Mapping", service: "Lead Generation", status: "in_progress", progress: 75, budget: 16500 },
  ];

  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i];
    const client = sampleClients[i % sampleClients.length];
    await db.project.create({
      data: {
        ...p,
        clientId: client.id,
        dueDate: new Date(Date.now() + (30 + i * 14) * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`Created ${projectsData.length} sample projects`);

  // Sample contact messages
  const messages = [
    { name: "Olivia Hart", email: "olivia@northpeak.io", subject: "Strategy call request", message: "Hi, I'd like to book a free strategy call this week. We're a Series A SaaS looking to scale paid." },
    { name: "Ravi Menon", email: "ravi@finedge.in", subject: "Automation inquiry", message: "We need help automating our CRM + ops workflow. Can you share a case study?" },
    { name: "Emma Larsen", email: "emma@loopco.com", subject: "SEO audit", message: "Do you offer one-off technical SEO audits? Our organic traffic dropped 30% after the last core update." },
  ];
  for (const m of messages) {
    await db.contactMessage.create({ data: m });
  }
  console.log(`Created ${messages.length} contact messages`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
