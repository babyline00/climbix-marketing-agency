import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ testimonials });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const t = await db.testimonial.create({
      data: {
        clientName: body.clientName,
        clientTitle: body.clientTitle || null,
        clientCompany: body.clientCompany || null,
        avatar: body.avatar || null,
        rating: body.rating ? Number(body.rating) : 5,
        message: body.message,
        active: body.active ?? true,
      },
    });
    return NextResponse.json({ testimonial: t }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.rating !== undefined) data.rating = Number(data.rating);
    const t = await db.testimonial.update({ where: { id }, data });
    return NextResponse.json({ testimonial: t });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete testimonial" }, { status: 500 });
  }
}
