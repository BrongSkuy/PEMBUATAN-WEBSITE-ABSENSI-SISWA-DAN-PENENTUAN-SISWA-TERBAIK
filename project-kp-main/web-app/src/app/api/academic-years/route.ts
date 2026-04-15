import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/academic-years — list all
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.select().from(academicYears).all();
  return NextResponse.json(result);
}

// POST /api/academic-years — create new
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as Record<string, unknown>).appRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { tahunAjaran, semester, isActive } = body;

    if (!tahunAjaran || !semester) {
      return NextResponse.json({ error: "Tahun ajaran dan semester wajib diisi" }, { status: 400 });
    }

    const [newAy] = await db
      .insert(academicYears)
      .values({
        tahunAjaran,
        semester,
        isActive: isActive || false,
      })
      .returning();

    return NextResponse.json(newAy, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan tahun ajaran";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
