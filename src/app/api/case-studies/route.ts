import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const studies = await db.caseStudy.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ caseStudies: studies });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cs = await db.caseStudy.create({
      data: {
        title: body.title,
        category: body.category,
        clientName: body.clientName,
        challenge: body.challenge,
        result: body.result,
        metric1Label: body.metric1Label || null,
        metric1Value: body.metric1Value || null,
        metric2Label: body.metric2Label || null,
        metric2Value: body.metric2Value || null,
        metric3Label: body.metric3Label || null,
        metric3Value: body.metric3Value || null,
        featured: body.featured ?? false,
      },
    });
    return NextResponse.json({ caseStudy: cs }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create case study" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const cs = await db.caseStudy.update({ where: { id }, data });
    return NextResponse.json({ caseStudy: cs });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update case study" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.caseStudy.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete case study" }, { status: 500 });
  }
}
