"use client";

import { Trophy, Download, RotateCcw, Upload, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { mockLeaderboard } from "@/lib/mock-data";

const archives = [
  { id: "1", namaFile: "Leaderboard_2024-2025_Genap.xlsx", periode: "2024/2025 Genap", uploadedAt: "15 Jun 2025" },
  { id: "2", namaFile: "Leaderboard_2024-2025_Ganjil.xlsx", periode: "2024/2025 Ganjil", uploadedAt: "20 Des 2024" },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow-lg shadow-amber-500/30">1</div>;
  if (rank === 2) return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-sm font-bold text-white shadow-lg shadow-gray-400/30">2</div>;
  if (rank === 3) return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-sm font-bold text-white shadow-lg shadow-amber-700/30">3</div>;
  return <span className="pl-2.5 text-sm font-medium text-muted-foreground">#{rank}</span>;
}

export default function AdminLeaderboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard & Arsip"
        description="Peringkat siswa terbaik dan arsip semester sebelumnya"
        icon={Trophy}
      >
        <Dialog>
          <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" />}>
              <RotateCcw className="h-4 w-4" /> Reset Semester
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Leaderboard Semester?</DialogTitle>
              <DialogDescription>
                Tindakan ini akan mengarsipkan data leaderboard semester ini dan mereset semua skor untuk semester baru. Pastikan Anda sudah mengekspor data terlebih dahulu.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Batal</Button>
              <Button variant="destructive">Ya, Reset Semester</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
          <Download className="h-4 w-4" /> Export Excel
        </Button>
        <Button variant="outline" size="sm" className="gap-2 border-navy-200 text-navy-600 hover:bg-navy-50">
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </PageHeader>

      {/* Leaderboard Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Peringkat Semester Aktif</CardTitle>
          <CardDescription>Semester Genap 2025/2026</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="umum">
            <TabsList className="mb-4">
              <TabsTrigger value="kelas">Per Kelas</TabsTrigger>
              <TabsTrigger value="angkatan">Per Angkatan</TabsTrigger>
              <TabsTrigger value="umum">Umum</TabsTrigger>
            </TabsList>

            <TabsContent value="umum">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 pl-4">Rank</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead className="text-right">Skor SPK</TableHead>
                    <TableHead className="text-right pr-4">Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaderboard.map((entry) => (
                    <TableRow key={entry.studentId} className={entry.rank <= 3 ? "bg-amber-50/30" : ""}>
                      <TableCell className="pl-4"><RankBadge rank={entry.rank} /></TableCell>
                      <TableCell className="font-medium">{entry.namaLengkap}</TableCell>
                      <TableCell><Badge variant="outline">{entry.kelas}</Badge></TableCell>
                      <TableCell className="text-right font-bold text-navy-700">{entry.skorSPK}</TableCell>
                      <TableCell className="text-right pr-4">
                        <span className="font-medium text-emerald-600">{entry.persentaseKehadiran}%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="kelas">
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">Pilih kelas untuk melihat peringkat per kelas</p>
              </div>
            </TabsContent>

            <TabsContent value="angkatan">
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">Pilih angkatan untuk melihat peringkat per angkatan</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Archives */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Arsip Historis</CardTitle>
            <CardDescription>File rekapitulasi semester sebelumnya</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" /> Upload Arsip
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {archives.map((arc) => (
              <div key={arc.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{arc.namaFile}</p>
                    <p className="text-xs text-muted-foreground">
                      Periode: {arc.periode} · Upload: {arc.uploadedAt}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-navy-600">
                  <Download className="h-3.5 w-3.5" /> Unduh
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
