import { NextResponse } from "next/server";
import { db } from "@/db";
import { teachers, teacherClasses, classes, attendance, students } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/teachers/me/dashboard — get dashboard stats & classes for logged in teacher
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appRole = (session.user as Record<string, unknown>)?.appRole;
  if (appRole !== "GURU" && appRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // 1. Get teacher profile
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.userId, session.user.id));

    let assignedClasses: { id: string; namaKelas: string; tingkat: string; waliKelas: string | null }[] = [];

    if (teacher) {
      // Get classes assigned to this teacher
      const myClasses = await db
        .select({
          kelasId: classes.id,
          namaKelas: classes.namaKelas,
          tingkat: classes.tingkat,
          waliKelas: classes.waliKelas,
        })
        .from(teacherClasses)
        .innerJoin(classes, eq(teacherClasses.kelas, classes.namaKelas))
        .where(eq(teacherClasses.teacherId, teacher.id))
        .all();
        
      assignedClasses = myClasses
        .filter((v, i, a) => a.findIndex(t => (t.kelasId === v.kelasId)) === i)
        .map(c => ({
          id: c.kelasId,
          namaKelas: c.namaKelas,
          tingkat: c.tingkat,
          waliKelas: c.waliKelas,
        }));
    } else if (appRole === "ADMIN") {
       // If admin, maybe return all classes or just empty if they are acting as a generic teacher view
       assignedClasses = await db.select().from(classes).all();
    }

    // 2. Check today's attendance for those classes
    const today = new Date().toISOString().split("T")[0];
    
    // We get all attendance for today recorded by this user, OR just for the classes they teach
    // Let's get attendance for today for students in assigned classes
    
    const classesStatus = [];
    let classesDiabsen = 0;

    for (const c of assignedClasses) {
      // Find students in this class
      const classStudents = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.kelas, c.namaKelas))
        .all();

      if (classStudents.length === 0) {
         classesStatus.push({ ...c, statusAbsensiHariIni: "Belum Diabsen" });
         continue;
      }

      const studentIds = classStudents.map(s => s.id);
      
      // Check if there is any attendance for these students today
      // Because sqlite doesn't easily support where in array without special syntax, we query all attendance today 
      // and match
      const todayAttendance = await db
        .select({ id: attendance.id })
        .from(attendance)
        .where(eq(attendance.tanggal, today))
        .all();
        
      // Filter attendance records that belong to students in this class
      const hasAttendance = todayAttendance.some(a => {
         // this is inefficient but fine for small sqlite db.
         // A better way is joining. Let's do it right.
         return false;
      });
      // Better way: Join attendance & students
      const attendanceForClassToday = await db
         .select({ id: attendance.id })
         .from(attendance)
         .innerJoin(students, eq(attendance.studentId, students.id))
         .where(
            and(
               eq(students.kelas, c.namaKelas),
               eq(attendance.tanggal, today)
            )
         )
         .all();

      if (attendanceForClassToday.length > 0) {
         classesDiabsen++;
         classesStatus.push({ ...c, statusAbsensiHariIni: "Sudah Diabsen" });
      } else {
         classesStatus.push({ ...c, statusAbsensiHariIni: "Belum Diabsen" });
      }
    }

    // Calculate generic rata-rata kehadiran (placeholder or real logic)
    // Real logic: get all attendance by this teacher and calculate present / total
    
    // Fallback ratarata: Let's count all "Hadir" out of all Records in the classes they teach
    let rataRataKehadiran = "-";
    if (assignedClasses.length > 0) {
       const classNames = assignedClasses.map(c => c.namaKelas);
       // Let's just fix it later if needed, or query correctly.
       // For now, let's use a simple query
       const properAtt = await db
          .select({ status: attendance.status })
          .from(attendance)
          .innerJoin(students, eq(attendance.studentId, students.id))
          .where(inArray(students.kelas, classNames.length > 0 ? classNames : ["__empty__"]))
          .all();
          
       if (properAtt.length > 0) {
          const hadir = properAtt.filter(a => a.status === "Hadir").length;
          rataRataKehadiran = Math.round((hadir / properAtt.length) * 100) + "%";
       } else {
          rataRataKehadiran = "0%";
       }
    }

    return NextResponse.json({
      totalKelasDiampu: assignedClasses.length,
      sudahDiabsenHariIni: classesDiabsen,
      rataRataKehadiran,
      classes: classesStatus,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data dashboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
