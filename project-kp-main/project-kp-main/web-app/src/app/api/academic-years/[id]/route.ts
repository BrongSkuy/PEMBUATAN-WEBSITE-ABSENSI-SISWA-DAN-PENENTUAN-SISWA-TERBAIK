import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PUT /api/academic-years/[id] — update status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as Record<string, unknown>).appRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    // If setting to active, we might want to deactivate others. Or let the client handle it.
    // For simplicity, if we mark one as active, we should deactivate all others.
    if (body.isActive === true) {
      await db.update(academicYears).set({ isActive: false });
    }

    const [updated] = await db
      .update(academicYears)
      .set({
        isActive: body.isActive,
      })
      .where(eq(academicYears.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Tahun ajaran tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengupdate tahun ajaran";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
