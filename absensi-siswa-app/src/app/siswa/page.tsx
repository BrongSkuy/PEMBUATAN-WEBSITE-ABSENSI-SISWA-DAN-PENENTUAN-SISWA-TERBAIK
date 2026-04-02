"use client";

import {
  LayoutDashboard,
  CalendarCheck,
  Trophy,
  Medal,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockMonthlyAttendance, mockLeaderboard } from "@/lib/mock-data";

const myData = {
  nama: "Andi Pratama",
  nis: "2024001",
  kelas: "X-A",
  angkatan: "2024",
};

const kelasLeaderboard = mockLeaderboard.filter((e) => e.kelas === "X-A");

export default function SiswaDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Siswa"
        description={`Selamat datang, ${myData.nama}`}
        icon={LayoutDashboard}
      />

      {/* Profile Card */}
      <Card className="border-navy-100 bg-gradient-to-r from-navy-500 to-navy-700 text-white">
        <CardContent className="flex items-center gap-4 py-5">
          <Avatar className="h-14 w-14 border-2 border-white/30">
            <AvatarFallback className="bg-white/20 text-lg font-bold text-white">
              AP
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{myData.nama}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                NIS: {myData.nis}
              </Badge>
              <Badge className="bg-amber-500 text-navy-950 hover:bg-amber-400">
                Kelas {myData.kelas}
              </Badge>
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                Angkatan {myData.angkatan}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Persentase Kehadiran"
          value="96%"
          subtitle="semester ini"
          icon={CalendarCheck}
          color="emerald"
          trend={{ value: 1.5, isPositive: true }}
        />
        <StatCard
          title="Ranking Kelas"
          value="#2"
          subtitle="dari 32 siswa"
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Ranking Angkatan"
          value="#5"
          subtitle="dari 62 siswa"
          icon={Medal}
          color="navy"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Grafik Kehadiran Bulanan
            </CardTitle>
            <CardDescription>
              Riwayat kehadiran 6 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyAttendance}>
                  <defs>
                    <linearGradient id="fillHadir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#22C55E"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="bulan"
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
                  <Area
                    type="monotone"
                    dataKey="hadir"
                    name="Hari Hadir"
                    stroke="#22C55E"
                    strokeWidth={2.5}
                    fill="url(#fillHadir)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mini leaderboard kelas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Top 5 Kelas {myData.kelas}
            </CardTitle>
            <CardDescription>Peringkat siswa terbaik di kelasmu</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 pl-6">#</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right pr-6">Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kelasLeaderboard.slice(0, 5).map((entry) => (
                  <TableRow
                    key={entry.studentId}
                    className={
                      entry.namaLengkap === myData.nama
                        ? "bg-amber-50/50 font-semibold"
                        : ""
                    }
                  >
                    <TableCell className="pl-6">
                      {entry.rank <= 3 ? (
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                            entry.rank === 1
                              ? "bg-amber-500"
                              : entry.rank === 2
                                ? "bg-gray-400"
                                : "bg-amber-700"
                          }`}
                        >
                          {entry.rank}
                        </span>
                      ) : (
                        <span className="pl-1.5 text-muted-foreground">
                          {entry.rank}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.namaLengkap}
                      {entry.namaLengkap === myData.nama && (
                        <Badge className="ml-2 bg-navy-500 text-[10px] text-white">
                          Kamu
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-navy-600 pr-6">
                      {entry.skorSPK}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
