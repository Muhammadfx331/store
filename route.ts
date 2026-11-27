import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { checklist, downloads } from "@/db/schema";

/** عدد التنزيلات لكل ملف + آخر 8 عمليات */
export async function GET() {
  try {
    const perFile = await db
      .select({ file: downloads.file, count: sql<number>`count(*)::int` })
      .from(downloads)
      .groupBy(downloads.file);

    const total = await db.select({ value: sql<number>`count(*)::int` }).from(downloads);
    const steps = await db.select().from(checklist);
    const recent = await db
      .select({ file: downloads.file, label: downloads.label, createdAt: downloads.createdAt })
      .from(downloads)
      .orderBy(desc(downloads.createdAt))
      .limit(8);

    return NextResponse.json({
      ok: true,
      total: total[0]?.value ?? 0,
      perFile: Object.fromEntries(perFile.map((r) => [r.file, r.count])),
      doneSteps: steps.filter((s) => s.done).map((s) => s.key),
      recent,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "db error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
