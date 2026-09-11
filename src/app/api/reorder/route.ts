import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { model, items } = await req.json();
    if (!model || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "model and items[] required" }, { status: 400 });
    }
    const validModels = ["service", "caseStudy", "blogPost"] as const;
    if (!validModels.includes(model)) {
      return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 });
    }
    await db.$transaction(
      items.map((item: { id: string; order: number }) =>
        (db as any)[model].update({ where: { id: item.id }, data: { order: item.order } })
      )
    );
    return NextResponse.json({ ok: true, updated: items.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Reorder failed" }, { status: 500 });
  }
}
