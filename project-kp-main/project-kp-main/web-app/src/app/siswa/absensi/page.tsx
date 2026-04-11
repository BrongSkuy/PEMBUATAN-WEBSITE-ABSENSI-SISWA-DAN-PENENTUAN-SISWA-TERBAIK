"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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

interface AttendanceRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  mapel: string;
  status: StatusType;
}

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const statusColorMap: Record<string, string> = {
  Hadir: "bg-emerald-400 text-white",
  Izin: "bg-amber-400 text-white",
  Sakit: "bg-sky-400 text-white",
  Alfa: "bg-red-400 text-white",
};

export default function SiswaAbsensiPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students/me/attendance")
      .then(res => res.json())
      .then(data => {
        setAttendanceRecords(data);
        setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
  }, []);

  // Generate calendar data based on fetched records
  const generateCalendarData = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days: { date: number; status: StatusType; isWeekend: boolean }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(year, month, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      // Find record for this date
      const record = attendanceRecords.find(r => r.tanggal === dateStr);

      days.push({
        date: d,
        status: isWeekend ? null : (record?.status || null),
        isWeekend,
      });
    }

    return { days, firstDay };
  };

  const { days, firstDay } = generateCalendarData(currentYear, currentMonth);

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Sort descending by date
  const sortedRecords = [...attendanceRecords].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  const recentHistory = sortedRecords.slice(0, 8);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="animate-spin h-8 w-8 text-navy-500" />
        </div>
     );
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Absensi" description="Catatan kehadiran Anda sepanjang semester" icon={CalendarCheck} />

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-emerald-400" /><span className="text-xs text-muted-foreground">Hadir</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-amber-400" /><span className="text-xs text-muted-foreground">Izin</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-sky-400" /><span className="text-xs text-muted-foreground">Sakit</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-red-400" /><span className="text-xs text-muted-foreground">Alfa</span></div>
        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-gray-200" /><span className="text-xs text-muted-foreground">Belum ada / Libur</span></div>
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
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" size="icon" className="h-8 w-8"
                onClick={handleNextMonth}
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
            <CardDescription>{recentHistory.length > 0 ? "Absensi terakhir" : "Belum ada absensi"}</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Tanggal</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.length > 0 ? recentHistory.map((r, i) => {
                  try {
                    const parsedDate = new Date(r.tanggal);
                    const formattedDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsedDate);
                    const hariName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(parsedDate);

                    return (
                      <TableRow key={i}>
                        <TableCell className="pl-6">
                          <p className="text-sm font-medium">{formattedDate}</p>
                          <p className="text-xs text-muted-foreground">{hariName}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-navy-50 text-navy-700 border-navy-200">
                             {r.mapel || "Umum"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge className={`${r.status ? statusColorMap[r.status] : "bg-gray-200"}`}>
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  } catch (e) {
                     return null;
                  }
                }) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                      Belum ada data riwayat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
