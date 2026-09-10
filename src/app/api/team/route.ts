import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ team });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const m = await db.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        avatar: body.avatar || null,
        email: body.email || null,
        linkedin: body.linkedin || null,
        twitter: body.twitter || null,
        order: body.order ? Number(body.order) : 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json({ member: m }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create team member" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.order !== undefined) data.order = Number(data.order);
    const m = await db.teamMember.update({ where: { id }, data });
    return NextResponse.json({ member: m });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.teamMember.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete team member" }, { status: 500 });
  }
}
