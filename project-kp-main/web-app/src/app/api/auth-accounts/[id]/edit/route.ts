import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PUT /api/auth-accounts/[id]/edit — edit name and username
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

  if (!body.name) {
    return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
  }

  try {
    const [updated] = await db
      .update(user)
      .set({ 
        name: body.name,
        username: body.username || null 
      })
      .where(eq(user.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengupdate profil akun";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
