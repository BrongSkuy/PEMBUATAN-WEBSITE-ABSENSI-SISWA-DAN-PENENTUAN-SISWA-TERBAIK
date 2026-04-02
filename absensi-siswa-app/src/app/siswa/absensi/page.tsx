"use client";

import { useState } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type StatusType = "Hadir" | "Izin" | "Sakit" | "Alfa" | null;

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// Generate mock calendar data for current month
function generateCalendarData(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const statuses: StatusType[] = ["Hadir", "Hadir", "Hadir", "Hadir", "Hadir", "Izin", "Sakit", "Hadir", "Hadir", "Alfa"];

  const days: { date: number; status: StatusType; isWeekend: boolean }[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    days.push({
      date: d,
      status: isWeekend ? null : statuses[(d - 1) % statuses.length],
      isWeekend,
    });
  }

  return { days, firstDay, daysInMonth };
}

const statusColorMap: Record<string, string> = {
  Hadir: "bg-emerald-400 text-white",
  Izin: "bg-amber-400 text-white",
  Sakit: "bg-sky-400 text-white",
  Alfa: "bg-red-400 text-white",
};

const recentHistory = [
  { tanggal: "2 Apr 2026", hari: "Kamis", status: "Hadir" as StatusType },
  { tanggal: "1 Apr 2026", hari: "Rabu", status: "Hadir" as StatusType },
  { tanggal: "31 Mar 2026", hari: "Selasa", status: "Izin" as StatusType },
  { tanggal: "30 Mar 2026", hari: "Senin", status: "Hadir" as StatusType },
  { tanggal: "27 Mar 2026", hari: "Jumat", status: "Hadir" as StatusType },
  { tanggal: "26 Mar 2026", hari: "Kamis", status: "Sakit" as StatusType },
  { tanggal: "25 Mar 2026", hari: "Rabu", status: "Hadir" as StatusType },
  { tanggal: "24 Mar 2026", hari: "Selasa", status: "Hadir" as StatusType },
];

export default function SiswaAbsensiPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  const { days, firstDay } = generateCalendarData(currentYear, currentMonth);

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Absensi" description="Catatan kehadiran Anda sepanjang semester" icon={CalendarCheck} />

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-emerald-400" /><span className="text-xs text-muted-foreground">Hadir</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-amber-400" /><span className="text-xs text-muted-foreground">Izin</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-sky-400" /><span className="text-xs text-muted-foreground">Sakit</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-red-400" /><span className="text-xs text-muted-foreground">Alfa</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-gray-200" /><span className="text-xs text-muted-foreground">Libur</span></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">
              {months[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => setCurrentMonth((m) => Math.max(0, m - 1))}
                disabled={currentMonth === 0}
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => setCurrentMonth((m) => Math.min(11, m + 1))}
                disabled={currentMonth === 11}
                aria-label="Bulan selanjutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => (
                <div
                  key={day.date}
                  className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    day.isWeekend
                      ? "bg-gray-100 text-gray-400"
                      : day.status
                        ? `${statusColorMap[day.status]} shadow-sm`
                        : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {day.date}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Riwayat Terkini</CardTitle>
            <CardDescription>8 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Tanggal</TableHead>
                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <p className="text-sm font-medium">{r.tanggal}</p>
                      <p className="text-xs text-muted-foreground">{r.hari}</p>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge className={`${r.status ? statusColorMap[r.status] : "bg-gray-200"}`}>
                        {r.status}
                      </Badge>
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
