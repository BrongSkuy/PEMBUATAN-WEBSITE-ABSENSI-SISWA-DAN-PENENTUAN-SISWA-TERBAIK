"use client";

import {
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Trophy,
  Upload,
  Settings2,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockWeeklyAttendance,
  mockLeaderboard,
  mockStudents,
  mockTeachers,
} from "@/lib/mock-data";

export default function AdminDashboard() {
  const todayPercentage = Math.round(
    (mockWeeklyAttendance[0].hadir /
      (mockWeeklyAttendance[0].hadir +
        mockWeeklyAttendance[0].izin +
        mockWeeklyAttendance[0].sakit +
        mockWeeklyAttendance[0].alfa)) *
      100
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Admin"
        description="Ringkasan data keseluruhan sistem"
        icon={LayoutDashboard}
      />

      {/* Stats */}
      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Siswa"
          value={mockStudents.length}
          subtitle="siswa aktif"
          icon={Users}
          color="navy"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Total Guru"
          value={mockTeachers.length}
          subtitle="guru aktif"
          icon={GraduationCap}
          color="amber"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={`${todayPercentage}%`}
          subtitle="dari total siswa"
          icon={CalendarCheck}
          color="emerald"
          trend={{ value: 1.3, isPositive: true }}
        />
        <StatCard
          title="Semester Aktif"
          value="Genap"
          subtitle="2025/2026"
          icon={BookOpen}
          color="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Kehadiran Minggu Ini</CardTitle>
            <CardDescription>
              Data kehadiran siswa selama 5 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWeeklyAttendance} barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hari"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  />
                  <Bar
                    dataKey="hadir"
                    name="Hadir"
                    fill="#22C55E"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="izin"
                    name="Izin"
                    fill="#f2a600"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="sakit"
                    name="Sakit"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="alfa"
                    name="Alfa"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
            <CardDescription>Pintasan menu utama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/siswa" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11 hover:border-navy-300 hover:bg-navy-50"
              >
                <Upload className="h-4 w-4 text-navy-500" />
                Import Data Siswa
              </Button>
            </Link>
            <Link href="/admin/spk" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11 hover:border-amber-300 hover:bg-amber-50"
              >
                <Settings2 className="h-4 w-4 text-amber-500" />
                Atur Bobot SPK
              </Button>
            </Link>
            <Link href="/admin/leaderboard" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11 hover:border-emerald-300 hover:bg-emerald-50"
              >
                <Trophy className="h-4 w-4 text-emerald-500" />
                Lihat Leaderboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Mini Leaderboard */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              <Trophy className="mr-2 inline-block h-4 w-4 text-amber-500" />
              Top 5 Siswa Terbaik
            </CardTitle>
            <CardDescription>
              Berdasarkan perhitungan SPK semester ini
            </CardDescription>
          </div>
          <Link href="/admin/leaderboard">
            <Button variant="ghost" size="sm" className="gap-1 text-navy-500">
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-right">Skor SPK</TableHead>
                <TableHead className="text-right">Kehadiran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaderboard.slice(0, 5).map((entry) => (
                <TableRow key={entry.studentId}>
                  <TableCell>
                    {entry.rank <= 3 ? (
                      <Badge
                        className={
                          entry.rank === 1
                            ? "bg-amber-500 text-white"
                            : entry.rank === 2
                              ? "bg-gray-400 text-white"
                              : "bg-amber-700 text-white"
                        }
                      >
                        #{entry.rank}
                      </Badge>
                    ) : (
                      <span className="pl-2 font-medium text-muted-foreground">
                        #{entry.rank}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.namaLengkap}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.kelas}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-navy-600">
                    {entry.skorSPK}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-emerald-600 font-medium">
                      {entry.persentaseKehadiran}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

