import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { spkScores, students, spkCriteria, academicYears } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/spk/scores?kelas=..&criteriaId=..&mapel=..
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kelas = searchParams.get("kelas");
  const criteriaId = searchParams.get("criteriaId");
  const mapel = searchParams.get("mapel") || null;

  if (!kelas || !criteriaId) {
    return NextResponse.json(
      { error: "Parameter kelas dan criteriaId wajib" },
      { status: 400 }
    );
  }

  // Get active period
  const [activeYear] = await db.select().from(academicYears).where(eq(academicYears.isActive, true));
  const periode = activeYear ? `${activeYear.tahunAjaran}-${activeYear.semester}` : "2025/2026-Genap";

  // Get students
  const siswaKelas = await db.select().from(students).where(eq(students.kelas, kelas)).all();
  
  // Get scores
  const scoresQuery = db.select().from(spkScores).where(
     and(
        eq(spkScores.criteriaId, criteriaId),
        eq(spkScores.periode, periode)
     )
  );

  const existingScores = await scoresQuery.all();
  
  // Filter by mapel manually if needed (or dynamically in query)
  let filteredScores = existingScores;
  if (mapel && mapel !== "Umum") {
     filteredScores = existingScores.filter(s => s.mapel === mapel);
  } else {
     // If mapel is required but we chose "Umum", we might want scores with mapel = null or 'Umum'
     filteredScores = existingScores.filter(s => !s.mapel || s.mapel === "Umum");
  }

  const result = siswaKelas.map((s) => {
    const record = filteredScores.find((r) => r.studentId === s.id);
    return {
      studentId: s.id,
      nis: s.nis,
      namaLengkap: s.namaLengkap,
      nilai: record?.nilai || 0,
      scoreId: record?.id || null,
    };
  });

  return NextResponse.json(result);
}

// POST /api/spk/scores
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const appRole = (session?.user as Record<string, unknown>)?.appRole;
  if (!session || (appRole !== "GURU" && appRole !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body: {
      criteriaId: string;
      mapel?: string;
      records: Array<{
        studentId: string;
        nilai: number;
      }>;
    } = await request.json();

    const mapel = body.mapel && body.mapel !== "Umum" ? body.mapel : null;

    if (!body.criteriaId || !body.records?.length) {
      return NextResponse.json({ error: "Data nilai tidak valid" }, { status: 400 });
    }

    const [activeYear] = await db.select().from(academicYears).where(eq(academicYears.isActive, true));
    const periode = activeYear ? `${activeYear.tahunAjaran}-${activeYear.semester}` : "2025/2026-Genap";

    for (const record of body.records) {
      // Delete old record
      let deleteCond = and(
         eq(spkScores.studentId, record.studentId),
         eq(spkScores.criteriaId, body.criteriaId),
         eq(spkScores.periode, periode)
      );

      // if mapel exists, filter by mapel too, else mapel is null
      if (mapel) {
         deleteCond = and(deleteCond, eq(spkScores.mapel, mapel));
      } else {
         const existingNull = await db.select().from(spkScores).where(deleteCond).all();
         const toDelete = existingNull.filter(x => !x.mapel || x.mapel === "Umum" || x.mapel === "").map(x => x.id);
         if (toDelete.length > 0) {
            for (const idToDelete of toDelete) {
               await db.delete(spkScores).where(eq(spkScores.id, idToDelete));
            }
         }
      }

      if (mapel) {
         await db.delete(spkScores).where(deleteCond);
      }

      await db.insert(spkScores).values({
        studentId: record.studentId,
        criteriaId: body.criteriaId,
        mapel: mapel,
        nilai: record.nilai,
        periode: periode,
      });
    }

    return NextResponse.json({ success: true, count: body.records.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan nilai";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/spk/scores
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const appRole = (session?.user as Record<string, unknown>)?.appRole;
  if (!session || (appRole !== "GURU" && appRole !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const kelas = searchParams.get("kelas");
  const criteriaId = searchParams.get("criteriaId");
  const mapel = searchParams.get("mapel") && searchParams.get("mapel") !== "Umum" ? searchParams.get("mapel") : null;

  if (!kelas || !criteriaId) {
    return NextResponse.json({ error: "Parameter wajib tidak lengkap" }, { status: 400 });
  }

  try {
    const [activeYear] = await db.select().from(academicYears).where(eq(academicYears.isActive, true));
    const periode = activeYear ? `${activeYear.tahunAjaran}-${activeYear.semester}` : "2025/2026-Genap";

    const siswaKelas = await db.select().from(students).where(eq(students.kelas, kelas)).all();
    
    for (const s of siswaKelas) {
      let cond = and(
         eq(spkScores.studentId, s.id),
         eq(spkScores.criteriaId, criteriaId),
         eq(spkScores.periode, periode)
      );

      if (mapel) {
         cond = and(cond, eq(spkScores.mapel, mapel));
      }

      // If mapel is not specified, it means we are deleting "Umum" score
      if (!mapel) {
         const allRecords = await db.select().from(spkScores).where(cond).all();
         for (const rec of allRecords) {
            if (!rec.mapel || rec.mapel === "Umum") {
               await db.delete(spkScores).where(eq(spkScores.id, rec.id));
            }
         }
      } else {
         await db.delete(spkScores).where(cond);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus nilai";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
