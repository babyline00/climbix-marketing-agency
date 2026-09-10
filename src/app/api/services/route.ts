import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ services });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = await db.service.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        tagline: body.tagline,
        description: body.description,
        icon: body.icon || null,
        features: body.features ? JSON.stringify(body.features) : null,
        order: body.order ? Number(body.order) : 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json({ service }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.features && typeof data.features !== "string") data.features = JSON.stringify(data.features);
    if (data.order !== undefined) data.order = Number(data.order);
    const service = await db.service.update({ where: { id }, data });
    return NextResponse.json({ service });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete service" }, { status: 500 });
  }
}
