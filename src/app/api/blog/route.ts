import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") === "true";
    const now = new Date();
    const where = publishedOnly
      ? { OR: [{ status: "published" }, { status: "scheduled", scheduledAt: { lte: now } }] }
      : {};
    const posts = await db.blogPost.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    // Auto-publish due scheduled posts
    const dueScheduled = posts.filter((p) => p.status === "scheduled" && p.scheduledAt && p.scheduledAt <= now);
    for (const p of dueScheduled) {
      await db.blogPost.update({ where: { id: p.id }, data: { status: "published", published: true } });
    }
    return NextResponse.json({ posts });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.excerpt || !body.content || !body.category || !body.author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const published = body.status === "published";
    const post = await db.blogPost.create({
      data: {
        title: body.title, slug, excerpt: body.excerpt, content: body.content,
        contentHtml: body.contentHtml || null, category: body.category,
        author: body.author, authorRole: body.authorRole || null, image: body.image || null,
        metaDescription: body.metaDescription || null,
        tags: body.tags ? (Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags) : null,
        ogImage: body.ogImage || null, status: body.status || "draft",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        featured: body.featured ?? false, readTime: body.readTime || null, published,
      },
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create blog post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.tags && Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
    if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
    if (data.status) data.published = data.status === "published";
    const post = await db.blogPost.update({ where: { id }, data });
    return NextResponse.json({ post });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete blog post" }, { status: 500 });
  }
}
