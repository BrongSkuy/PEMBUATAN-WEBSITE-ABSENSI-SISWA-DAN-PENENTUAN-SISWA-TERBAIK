import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as Record<string, unknown>).appRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const activeYears = await db.select().from(academicYears).where(eq(academicYears.isActive, true));
    const activeYear = activeYears[0];

    // Deactivate all
    await db.update(academicYears).set({ isActive: false });

    let nextTahun = "2025/2026";
    let nextSemester: "Ganjil" | "Genap" = "Genap";

    if (activeYear) {
      if (activeYear.semester === "Ganjil") {
        nextTahun = activeYear.tahunAjaran;
        nextSemester = "Genap";
      } else {
        const parts = activeYear.tahunAjaran.split("/");
        if (parts.length === 2) {
          const start = parseInt(parts[0]) + 1;
          const end = parseInt(parts[1]) + 1;
          nextTahun = `${start}/${end}`;
        }
        nextSemester = "Ganjil";
      }
    }

    const [newYear] = await db.insert(academicYears).values({
      tahunAjaran: nextTahun,
      semester: nextSemester,
      isActive: true,
    }).returning();

    return NextResponse.json({
      success: true,
      message: `Reset berhasil. Periode baru: ${nextTahun} ${nextSemester}`,
      newYear
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mereset periode";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
