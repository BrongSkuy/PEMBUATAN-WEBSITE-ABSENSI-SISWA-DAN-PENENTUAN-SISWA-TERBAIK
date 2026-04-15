import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teachers, teacherSubjects, academicYears } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PUT /api/teachers/[id] — update teacher
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
    const [updated] = await db
      .update(teachers)
      .set({
        namaLengkap: body.namaLengkap,
        status: body.status,
      })
      .where(eq(teachers.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    }

    if (body.mataPelajaran) {
       const [activeYear] = await db.select().from(academicYears).where(eq(academicYears.isActive, true));
       if (!activeYear) return NextResponse.json({ error: "Tidak ada periode aktif" }, { status: 400 });
       const periode = `${activeYear.tahunAjaran}-${activeYear.semester}`;

       await db.delete(teacherSubjects).where(and(eq(teacherSubjects.teacherId, id), eq(teacherSubjects.periode, periode)));
       if (Array.isArray(body.mataPelajaran) && body.mataPelajaran.length > 0) {
          for (const mapel of body.mataPelajaran) {
             await db.insert(teacherSubjects).values({
                teacherId: id,
                namaMapel: String(mapel),
                periode: periode
             });
          }
       }
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengupdate data guru";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/teachers/[id] — delete teacher
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as Record<string, unknown>).appRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(teachers)
      .where(eq(teachers.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    }

    await db.delete(teacherSubjects).where(eq(teacherSubjects.teacherId, id));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus data guru";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
