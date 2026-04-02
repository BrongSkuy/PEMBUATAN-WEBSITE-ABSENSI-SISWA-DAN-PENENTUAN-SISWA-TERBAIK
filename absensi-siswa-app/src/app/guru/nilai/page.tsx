"use client";

import { useState } from "react";
import { PenLine, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockStudents, mockKelas, mockSpkCriteria } from "@/lib/mock-data";

const manualCriteria = mockSpkCriteria.filter((c) => c.tipe === "Manual");

export default function GuruNilaiPage() {
  const [selectedKelas, setSelectedKelas] = useState("X-A");
  const [selectedCriteria, setSelectedCriteria] = useState(manualCriteria[0]?.id || "");
  const [showGrid, setShowGrid] = useState(false);

  const siswaKelas = mockStudents.filter((s) => s.kelas === selectedKelas);
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleLoad = () => {
    const init: Record<string, number> = {};
    siswaKelas.forEach((s) => { init[s.id] = Math.floor(Math.random() * 30) + 70; });
    setScores(init);
    setShowGrid(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Input Nilai Kriteria" description="Input nilai manual untuk kriteria SPK" icon={PenLine} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilih Kelas & Kriteria</CardTitle>
          <CardDescription>Tentukan kelas dan kriteria penilaian yang akan diinput</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2 flex-1">
              <Label>Kelas</Label>
              <Select value={selectedKelas} onValueChange={(val) => setSelectedKelas(val as string)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockKelas.filter((k) => ["X-A", "X-B"].includes(k.namaKelas)).map((k) => (
                    <SelectItem key={k.id} value={k.namaKelas}>{k.namaKelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Kriteria</Label>
              <Select value={selectedCriteria} onValueChange={(val) => setSelectedCriteria(val as string)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {manualCriteria.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.namaKriteria} (Bobot: {c.bobot}%)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-navy-500 hover:bg-navy-600" onClick={handleLoad}>
              Muat Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {showGrid && (
        <>
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-24">NIS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nama Siswa</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground w-32">Nilai (0-100)</th>
                  </tr>
                </thead>
                <tbody>
                  {siswaKelas.map((siswa, i) => (
                    <tr key={siswa.id} className="border-b transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-sm">{siswa.nis}</td>
                      <td className="px-4 py-3 text-sm font-medium">{siswa.namaLengkap}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={scores[siswa.id] || ""}
                            onChange={(e) =>
                              setScores((p) => ({
                                ...p,
                                [siswa.id]: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-20 text-center font-semibold"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="gap-2 bg-navy-500 hover:bg-navy-600 shadow-lg shadow-navy-500/20">
              <Save className="h-5 w-5" /> Simpan Nilai
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
