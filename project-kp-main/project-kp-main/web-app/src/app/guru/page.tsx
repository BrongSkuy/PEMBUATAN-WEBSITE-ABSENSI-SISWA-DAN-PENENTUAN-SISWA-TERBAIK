"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

interface KelasRow {
  id: string;
  namaKelas: string;
  tingkat: string;
  waliKelas: string | null;
  statusAbsensiHariIni: "Sudah Diabsen" | "Belum Diabsen";
}

interface DashboardData {
  totalKelasDiampu: number;
  sudahDiabsenHariIni: number;
  rataRataKehadiran: string;
  classes: KelasRow[];
}

export default function GuruDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  const teacherName = session?.user?.name || "Guru";

  useEffect(() => {
    fetch("/api/teachers/me/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-500" />
      </div>
    );
  }

  const classes = data?.classes || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Guru"
        description={`Selamat datang, ${teacherName}`}
        icon={LayoutDashboard}
      />

      {/* Stats */}
      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Kelas Diampu"
          value={data?.totalKelasDiampu ?? 0}
          subtitle="kelas aktif"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Sudah Diabsen Hari Ini"
          value={data?.sudahDiabsenHariIni ?? 0}
          subtitle="dari total kelas"
          icon={ClipboardCheck}
          color="amber"
        />
        <StatCard
          title="Rata-rata Kehadiran"
          value={data?.rataRataKehadiran ?? "-"}
          subtitle="seluruh kelas diampu"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Kelas Cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Kelas yang Diampu</h2>
        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Anda belum diatur (di-assign) ke kelas manapun.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {classes.map((kelas) => (
              <Card
                key={kelas.id}
                className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{kelas.namaKelas}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        kelas.statusAbsensiHariIni === "Sudah Diabsen"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }
                    >
                      {kelas.statusAbsensiHariIni}
                    </Badge>
                  </div>
                  <CardDescription>
                    Tingkat {kelas.tingkat} · Wali: {kelas.waliKelas || "-"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Link href={`/guru/absensi?kelas=${kelas.namaKelas}`} className="flex-1">
                    <Button
                      className="w-full gap-2 bg-navy-500 hover:bg-navy-600"
                      size="sm"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Mulai Absensi
                    </Button>
                  </Link>
                  <Link href={`/guru/rekap?kelas=${kelas.namaKelas}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-navy-200 text-navy-600 hover:bg-navy-50"
                    >
                      Rekap <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
