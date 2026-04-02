"use client";

import { useState } from "react";
import {
  ClipboardCheck, Save, Download, Upload, CheckCheck, Calendar as CalendarIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockStudents, mockKelas } from "@/lib/mock-data";

type Status = "Hadir" | "Izin" | "Sakit" | "Alfa";

const statusColors: Record<Status, string> = {
  Hadir: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  Izin: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  Sakit: "bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200",
  Alfa: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
};

const statusList: Status[] = ["Hadir", "Izin", "Sakit", "Alfa"];

export default function GuruAbsensiPage() {
  const [selectedKelas, setSelectedKelas] = useState("X-A");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [showGrid, setShowGrid] = useState(false);

  const siswaKelas = mockStudents.filter((s) => s.kelas === selectedKelas);

  const [attendanceData, setAttendanceData] = useState<Record<string, Status>>(() => {
    const init: Record<string, Status> = {};
    siswaKelas.forEach((s) => { init[s.id] = "Hadir"; });
    return init;
  });

  const handleStatusChange = (studentId: string, status: Status) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const all: Record<string, Status> = {};
    siswaKelas.forEach((s) => { all[s.id] = "Hadir"; });
    setAttendanceData(all);
  };

  const handleLoadGrid = () => {
    const init: Record<string, Status> = {};
    mockStudents.filter((s) => s.kelas === selectedKelas).forEach((s) => {
      init[s.id] = "Hadir";
    });
    setAttendanceData(init);
    setShowGrid(true);
  };

  const summary = {
    hadir: Object.values(attendanceData).filter((s) => s === "Hadir").length,
    izin: Object.values(attendanceData).filter((s) => s === "Izin").length,
    sakit: Object.values(attendanceData).filter((s) => s === "Sakit").length,
    alfa: Object.values(attendanceData).filter((s) => s === "Alfa").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Absensi Siswa"
        description="Input kehadiran siswa per kelas"
        icon={ClipboardCheck}
      >
        <Button variant="outline" size="sm" className="gap-2 border-navy-200 text-navy-600 hover:bg-navy-50">
          <Download className="h-4 w-4" /> Template
        </Button>
        <Button variant="outline" size="sm" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
          <Upload className="h-4 w-4" /> Import
        </Button>
      </PageHeader>

      {/* Step 1: Select class & date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilih Kelas & Tanggal</CardTitle>
          <CardDescription>Tentukan kelas dan tanggal absensi yang akan diinput</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2 flex-1">
              <Label>Kelas</Label>
              <Select value={selectedKelas} onValueChange={(val) => setSelectedKelas(val as string)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockKelas.filter((k) => ["X-A", "X-B"].includes(k.namaKelas)).map((k) => (
                    <SelectItem key={k.id} value={k.namaKelas}>{k.namaKelas} ({k.jumlahSiswa} siswa)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Tanggal</Label>
              <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <Button className="bg-navy-500 hover:bg-navy-600 gap-2" onClick={handleLoadGrid}>
              <CalendarIcon className="h-4 w-4" /> Muat Absensi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Attendance Grid */}
      {showGrid && (
        <>
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="status-hadir gap-1 px-3 py-1.5 text-sm">
              Hadir: {summary.hadir}
            </Badge>
            <Badge className="status-izin gap-1 px-3 py-1.5 text-sm">
              Izin: {summary.izin}
            </Badge>
            <Badge className="status-sakit gap-1 px-3 py-1.5 text-sm">
              Sakit: {summary.sakit}
            </Badge>
            <Badge className="status-alfa gap-1 px-3 py-1.5 text-sm">
              Alfa: {summary.alfa}
            </Badge>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleMarkAllPresent}>
                <CheckCheck className="h-4 w-4" /> Tandai Semua Hadir
              </Button>
            </div>
          </div>

          {/* Grid Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-24">NIS</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nama Siswa</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siswaKelas.map((siswa, i) => {
                      const currentStatus = attendanceData[siswa.id] || "Hadir";
                      return (
                        <tr
                          key={siswa.id}
                          className="border-b transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-3 font-mono text-sm">{siswa.nis}</td>
                          <td className="px-4 py-3 text-sm font-medium">{siswa.namaLengkap}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              {statusList.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(siswa.id, status)}
                                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                    currentStatus === status
                                      ? `${statusColors[status]} ring-2 ring-offset-1 ${
                                          status === "Hadir" ? "ring-emerald-400" :
                                          status === "Izin" ? "ring-amber-400" :
                                          status === "Sakit" ? "ring-sky-400" :
                                          "ring-red-400"
                                        } scale-105`
                                      : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                                  }`}
                                  aria-label={`Tandai ${siswa.namaLengkap} ${status}`}
                                >
                                  {status === "Hadir" ? "H" :
                                   status === "Izin" ? "I" :
                                   status === "Sakit" ? "S" : "A"}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg" className="gap-2 bg-navy-500 hover:bg-navy-600 shadow-lg shadow-navy-500/20">
              <Save className="h-5 w-5" /> Simpan Semua Absensi
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
