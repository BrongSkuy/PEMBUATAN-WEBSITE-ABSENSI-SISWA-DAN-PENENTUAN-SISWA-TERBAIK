import { NextResponse } from "next/server";
import { db } from "@/db";
import { teacherSubjects, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const appRole = (session?.user as Record<string, unknown>)?.appRole;
  if (!session || appRole !== "GURU") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get teacher profile
  const [teacherProfile] = await db
    .select()
    .from(teachers)
    .where(eq(teachers.userId, session.user.id));

  if (!teacherProfile) {
    return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
  }

  // Get subjects mapped to this teacher
  const subjects = await db
    .select({ namaMapel: teacherSubjects.namaMapel })
    .from(teacherSubjects)
    .where(eq(teacherSubjects.teacherId, teacherProfile.id));

  return NextResponse.json(subjects);
}
