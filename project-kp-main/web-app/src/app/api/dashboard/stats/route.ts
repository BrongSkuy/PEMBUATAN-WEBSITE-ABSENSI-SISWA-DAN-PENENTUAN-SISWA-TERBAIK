import { NextResponse } from "next/server";
import { db } from "@/db";
import { students, teachers, attendance, academicYears } from "@/db/schema";
import { eq, sql, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/dashboard/stats — dashboard statistics
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Count active students
  const [studentCount] = await db
    .select({ count: count() })
    .from(students)
    .where(eq(students.status, "aktif"));

  // Count active teachers
  const [teacherCount] = await db
    .select({ count: count() })
    .from(teachers)
    .where(eq(teachers.status, "aktif"));

  // Today's attendance percentage
  const today = new Date().toISOString().split("T")[0];
  const [todayAttendance] = await db
    .select({ count: count() })
    .from(attendance)
    .where(eq(attendance.tanggal, today));

  const [todayHadir] = await db
    .select({ count: count() })
    .from(attendance)
    .where(
      sql`${attendance.tanggal} = ${today} AND ${attendance.status} = 'Hadir'`
    );

  const kehadiranPersen = todayAttendance.count > 0
    ? Math.round((todayHadir.count / todayAttendance.count) * 100)
    : 0;

  // Active academic year
  const [activeYear] = await db
    .select()
    .from(academicYears)
    .where(eq(academicYears.isActive, true));

  // Weekly attendance (Last 5 days)
  const recentDates = await db
    .select({ tanggal: attendance.tanggal })
    .from(attendance)
    .groupBy(attendance.tanggal)
    .orderBy(sql`${attendance.tanggal} DESC`)
    .limit(5);

  const weeklyAttendance = [];
  // Reverse to show chronologically left-to-right (oldest -> newest)
  for (const row of [...recentDates].reverse()) {
    const records = await db.select().from(attendance).where(eq(attendance.tanggal, row.tanggal));
    const hadir = records.filter((r) => r.status === "Hadir").length;
    const izin = records.filter((r) => r.status === "Izin").length;
    const sakit = records.filter((r) => r.status === "Sakit").length;
    const alfa = records.filter((r) => r.status === "Alfa").length;
    
    // Parse "YYYY-MM-DD" safely
    const dObj = new Date(row.tanggal);
    const hari = isNaN(dObj.getTime()) ? row.tanggal : dObj.toLocaleDateString("id-ID", { weekday: 'short' });
    
    weeklyAttendance.push({ hari, hadir, izin, sakit, alfa });
  }

  return NextResponse.json({
    totalSiswa: studentCount.count,
    totalGuru: teacherCount.count,
    kehadiranHariIni: kehadiranPersen,
    tahunAjaran: activeYear
      ? `${activeYear.semester} ${activeYear.tahunAjaran}`
      : "-",
    weeklyAttendance,
  });
}
