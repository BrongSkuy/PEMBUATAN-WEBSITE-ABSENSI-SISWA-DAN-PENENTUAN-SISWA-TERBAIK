"use client";

import { Calendar, Plus, Archive, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const tahunAjaranData = [
  { id: "1", tahun: "2025/2026", semester: "Genap", status: "aktif", siswa: 150, startDate: "Jan 2026" },
  { id: "2", tahun: "2025/2026", semester: "Ganjil", status: "selesai", siswa: 148, startDate: "Jul 2025" },
  { id: "3", tahun: "2024/2025", semester: "Genap", status: "selesai", siswa: 142, startDate: "Jan 2025" },
  { id: "4", tahun: "2024/2025", semester: "Ganjil", status: "selesai", siswa: 140, startDate: "Jul 2024" },
];

export default function AdminTahunAjaranPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tahun Ajaran"
        description="Kelola tahun ajaran dan periode semester"
        icon={Calendar}
      >
        <Button variant="outline" size="sm" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
          <ArrowUpRight className="h-4 w-4" /> Kenaikan Kelas
        </Button>
        <Dialog>
          <DialogTrigger render={<Button size="sm" className="gap-2 bg-navy-500 hover:bg-navy-600" />}>
              <Plus className="h-4 w-4" /> Tahun Ajaran Baru
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Tahun Ajaran Baru</DialogTitle>
              <DialogDescription>Tentukan periode tahun ajaran dan semester</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tahun Ajaran</Label>
                <Input placeholder="Contoh: 2026/2027" />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Pilih semester" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ganjil">Ganjil</SelectItem>
                    <SelectItem value="genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Batal</Button>
              <Button className="bg-navy-500 hover:bg-navy-600">Buat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        {tahunAjaranData.map((ta) => (
          <Card
            key={ta.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              ta.status === "aktif" ? "border-emerald-200 ring-1 ring-emerald-100" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{ta.tahun}</CardTitle>
                <Badge
                  className={
                    ta.status === "aktif"
                      ? "bg-emerald-100 text-emerald-700 gap-1"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {ta.status === "aktif" && <CheckCircle2 className="h-3 w-3" />}
                  {ta.status === "aktif" ? "Aktif" : "Selesai"}
                </Badge>
              </div>
              <CardDescription>
                Semester {ta.semester} · Mulai {ta.startDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold text-navy-700">{ta.siswa}</span>{" "}
                  <span className="text-muted-foreground">siswa terdaftar</span>
                </div>
                {ta.status === "selesai" && (
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-navy-600">
                    <Archive className="h-3.5 w-3.5" /> Arsip
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
