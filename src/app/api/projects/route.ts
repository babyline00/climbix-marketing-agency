import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const where: any = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    const projects = await db.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });
    return NextResponse.json({ projects });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await db.project.create({
      data: {
        title: body.title,
        description: body.description || null,
        clientId: body.clientId,
        service: body.service,
        status: body.status || "planning",
        progress: body.progress ? Number(body.progress) : 0,
        budget: body.budget ? Number(body.budget) : null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create project" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.progress !== undefined) data.progress = Number(data.progress);
    if (data.budget !== undefined) data.budget = data.budget ? Number(data.budget) : null;
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const project = await db.project.update({ where: { id }, data });
    return NextResponse.json({ project });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete project" }, { status: 500 });
  }
}
