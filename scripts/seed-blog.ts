import { db } from "../src/lib/db";

const POSTS = [
  {
    slug: "ai-powered-growth-systems",
    title: "Why AI-Powered Growth Systems Beat Traditional Marketing in 2026",
    excerpt: "Traditional agencies sell services in silos. AI-powered growth systems connect every channel, every workflow, every dollar — engineered as one compounding engine.",
    content: "## The Silo Problem\n\nMost marketing agencies in 2026 still operate like it's 2015. They sell SEO as one service, paid ads as another, content as a third — each in its own silo.\n\n## What an AI-Powered Growth System Actually Is\n\nAn AI-powered growth system isn't a chatbot. It's a connected infrastructure where every channel feeds every other channel, every workflow is instrumented with attribution, and every decision is informed by AI models trained on your data.\n\n## Why Traditional Agencies Can't Do This\n\nTraditional agencies are structured around service lines — each with its own P&L, its own team, its own incentives. Building a connected growth system requires dissolving those silos.\n\n## The Bottom Line\n\nThe brands that win in 2026 won't be the ones with the biggest budgets or the most channels. They'll be the ones with the most connected, intelligent growth infrastructure.",
    category: "Growth Strategy", author: "Daniel Foster", authorRole: "Founder & CEO",
    image: "/images/blog/ai-growth-systems.png", readTime: "8 min read", status: "published", published: true, featured: true, order: 0,
  },
  {
    slug: "multi-touch-attribution-guide",
    title: "Multi-Touch Attribution: The Complete Guide for 2026",
    excerpt: "Last-click attribution is dead. Here's how to build a multi-touch attribution model that actually shows which channels drive revenue.",
    content: "## Why Last-Click Fails\n\nLast-click attribution assumes the last touch before conversion caused the conversion. That's like giving all the credit for a sale to the cashier.\n\n## Building a Multi-Touch Model\n\nA proper multi-touch attribution model assigns fractional credit to every touchpoint based on its role in the journey.\n\n## What Good Looks Like\n\nWhen your attribution is working, you'll see ROAS lift 30-50% within 90 days.",
    category: "Analytics", author: "Elena Vasquez", authorRole: "Head of Performance",
    image: "/images/blog/multi-touch-attribution.png", readTime: "12 min read", status: "published", published: true, featured: false, order: 1,
  },
  {
    slug: "ai-content-engine",
    title: "How We Built an AI Content Engine That Produces 60 Articles/Month",
    excerpt: "AI didn't replace our writers — it 4x'd their output. Here's the exact workflow we use to produce SEO content at scale.",
    content: "## The Old Way\n\nTraditional content production is sequential: research, outline, draft, edit, optimize, publish. A skilled writer produces 4-8 articles per month.\n\n## The New Way\n\nOur pipeline splits content production into specialized stages, with AI handling the heavy lifting and humans handling the judgment calls.\n\n## Results After 6 Months\n\n142 articles ranked in the top 10. 38,000 monthly organic visitors. 4× content output vs traditional agencies.",
    category: "Content", author: "Marcus Lee", authorRole: "Head of SEO & Content",
    image: "/images/blog/ai-content-engine.png", readTime: "10 min read", status: "published", published: true, featured: false, order: 2,
  },
];

async function main() {
  for (const p of POSTS) {
    const existing = await db.blogPost.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await db.blogPost.create({ data: p });
      console.log(`Created: ${p.title}`);
    } else {
      await db.blogPost.update({ where: { slug: p.slug }, data: p });
      console.log(`Updated: ${p.title}`);
    }
  }
  console.log("Done!");
}

main().catch(console.error).finally(() => db.$disconnect());
