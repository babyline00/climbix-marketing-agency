import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const clients = await db.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { projects: true },
    });
    return NextResponse.json({ clients });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await db.client.create({
      data: {
        name: body.name,
        company: body.company,
        email: body.email,
        phone: body.phone || null,
        website: body.website || null,
        industry: body.industry || null,
        status: body.status || "active",
        monthlyFee: body.monthlyFee ? Number(body.monthlyFee) : null,
        logo: body.logo || null,
      },
    });
    return NextResponse.json({ client }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create client" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.monthlyFee !== undefined) data.monthlyFee = data.monthlyFee ? Number(data.monthlyFee) : null;
    const client = await db.client.update({ where: { id }, data });
    return NextResponse.json({ client });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete client" }, { status: 500 });
  }
}
