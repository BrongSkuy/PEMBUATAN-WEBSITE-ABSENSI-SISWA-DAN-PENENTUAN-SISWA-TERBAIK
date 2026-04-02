"use client";

import { BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStudents } from "@/lib/mock-data";

const rekapXA = [
  { nama: "Andi Pratama", hadir: 20, izin: 1, sakit: 1, alfa: 0, persen: 91 },
  { nama: "Siti Nurhaliza", hadir: 21, izin: 0, sakit: 1, alfa: 0, persen: 95 },
  { nama: "Rizky Maulana", hadir: 19, izin: 2, sakit: 0, alfa: 1, persen: 86 },
  { nama: "Dewi Anggraini", hadir: 22, izin: 0, sakit: 0, alfa: 0, persen: 100 },
  { nama: "Farhan Hidayat", hadir: 20, izin: 1, sakit: 0, alfa: 1, persen: 91 },
];

const chartData = [
  { status: "Hadir", jumlah: 102 },
  { status: "Izin", jumlah: 4 },
  { status: "Sakit", jumlah: 2 },
  { status: "Alfa", jumlah: 2 },
];

export default function GuruRekapPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Rekap Kelas" description="Ringkasan kehadiran dan nilai siswa di kelas Anda" icon={BarChart3} />

      <Tabs defaultValue="X-A">
        <TabsList>
          <TabsTrigger value="X-A">Kelas X-A</TabsTrigger>
          <TabsTrigger value="X-B">Kelas X-B</TabsTrigger>
        </TabsList>

        <TabsContent value="X-A" className="space-y-6 mt-4">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ringkasan Kehadiran Bulan Ini</CardTitle>
              <CardDescription>Kelas X-A · Total 22 hari efektif</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="status" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "13px" }} />
                    <Bar dataKey="jumlah" fill="#1F4E78" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detail Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detail Per Siswa</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Nama</TableHead>
                    <TableHead className="text-center">Hadir</TableHead>
                    <TableHead className="text-center">Izin</TableHead>
                    <TableHead className="text-center">Sakit</TableHead>
                    <TableHead className="text-center">Alfa</TableHead>
                    <TableHead className="text-right pr-6">Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rekapXA.map((r) => (
                    <TableRow key={r.nama}>
                      <TableCell className="pl-6 font-medium">{r.nama}</TableCell>
                      <TableCell className="text-center"><Badge className="status-hadir">{r.hadir}</Badge></TableCell>
                      <TableCell className="text-center"><Badge className="status-izin">{r.izin}</Badge></TableCell>
                      <TableCell className="text-center"><Badge className="status-sakit">{r.sakit}</Badge></TableCell>
                      <TableCell className="text-center"><Badge className="status-alfa">{r.alfa}</Badge></TableCell>
                      <TableCell className="text-right pr-6">
                        <span className={`font-bold ${r.persen >= 90 ? "text-emerald-600" : r.persen >= 75 ? "text-amber-600" : "text-red-600"}`}>
                          {r.persen}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="X-B">
          <div className="py-12 text-center text-muted-foreground">
            <p>Data rekap kelas X-B akan tampil di sini</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
