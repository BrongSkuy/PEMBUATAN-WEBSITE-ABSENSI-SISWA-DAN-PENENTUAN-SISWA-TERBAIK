"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
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
import { mockKelas } from "@/lib/mock-data";

const kelasGuru = mockKelas.filter((k) =>
  ["X-A", "X-B"].includes(k.namaKelas)
);

export default function GuruDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Guru"
        description="Selamat datang, Sri Mulyani, S.Pd"
        icon={LayoutDashboard}
      />

      {/* Stats */}
      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Kelas Diampu"
          value={kelasGuru.length}
          subtitle="kelas aktif"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Sudah Diabsen Hari Ini"
          value="1 / 2"
          subtitle="kelas selesai"
          icon={ClipboardCheck}
          color="amber"
        />
        <StatCard
          title="Rata-rata Kehadiran"
          value="94.5%"
          subtitle="bulan ini"
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* Kelas Cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Kelas yang Diampu</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {kelasGuru.map((kelas, index) => (
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
                      index === 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }
                  >
                    {index === 0 ? "Sudah Diabsen" : "Belum Diabsen"}
                  </Badge>
                </div>
                <CardDescription>
                  Tingkat {kelas.tingkat} · {kelas.jumlahSiswa} Siswa
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Link href="/guru/absensi" className="flex-1">
                  <Button
                    className="w-full gap-2 bg-navy-500 hover:bg-navy-600"
                    size="sm"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Mulai Absensi
                  </Button>
                </Link>
                <Link href="/guru/rekap">
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
      </div>
    </div>
  );
}
