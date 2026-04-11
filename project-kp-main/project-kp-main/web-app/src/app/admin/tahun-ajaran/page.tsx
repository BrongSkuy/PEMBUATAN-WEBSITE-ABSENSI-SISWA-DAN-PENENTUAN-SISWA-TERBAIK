"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Archive, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

interface AcademicYearRow {
  id: string;
  tahunAjaran: string;
  semester: "Ganjil" | "Genap";
  isActive: boolean;
}

export default function AdminTahunAjaranPage() {
  const [open, setOpen] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYearRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formTahun, setFormTahun] = useState("");
  const [formSemester, setFormSemester] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/academic-years");
      const data = await res.json();
      setAcademicYears(data);
    } catch {
      toast.error("Gagal memuat data tahun ajaran");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setFormTahun("");
    setFormSemester("");
  };

  const handleCreate = async () => {
    if (!formTahun || !formSemester) {
      toast.error("Tahun ajaran dan semester wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/academic-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tahunAjaran: formTahun,
          semester: formSemester,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      toast.success("Tahun ajaran berhasil dibuat!");
      setOpen(false);
      resetForm();
      fetchData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal menambahkan tahun ajaran";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleArsip = async (ay: AcademicYearRow) => {
    if (!confirm(`Yakin ingin mengarsipkan ${ay.tahunAjaran} Semester ${ay.semester}?\nTahun ajaran ini akan dinonaktifkan.`)) return;

    try {
      const res = await fetch(`/api/academic-years/${ay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (!res.ok) throw new Error("Gagal mengarsipkan");

      toast.success(`Data ${ay.tahunAjaran} diarsipkan.`);
      fetchData();
    } catch {
      toast.error("Gagal mengarsipkan tahun ajaran.");
    }
  };

  const handleActivate = async (ay: AcademicYearRow) => {
    if (!confirm(`Aktifkan ${ay.tahunAjaran} Semester ${ay.semester} sebagai periode berjalan?\nPeriode lain akan otomatis diarsipkan.`)) return;

    try {
      const res = await fetch(`/api/academic-years/${ay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });

      if (!res.ok) throw new Error("Gagal mengaktifkan");

      toast.success(`${ay.tahunAjaran} Semester ${ay.semester} sekarang aktif.`);
      fetchData();
    } catch {
      toast.error("Gagal mengaktifkan tahun ajaran.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tahun Ajaran"
        description="Kelola tahun ajaran dan periode semester"
        icon={Calendar}
      >
        <Button variant="outline" size="sm" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => toast.info("Fitur kenaikan kelas akan tersedia saat fasa SPK dimulai.")}>
          <ArrowUpRight className="h-4 w-4" /> Kenaikan Kelas
        </Button>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger render={
             <Button size="sm" className="gap-2 bg-navy-500 hover:bg-navy-600">
              <Plus className="h-4 w-4" /> Tahun Ajaran Baru
             </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Tahun Ajaran Baru</DialogTitle>
              <DialogDescription>Tentukan periode tahun ajaran dan semester. Data lama akan tetap ada namun bersifat tidak aktif.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tahun Ajaran</Label>
                <Input placeholder="Contoh: 2026/2027" value={formTahun} onChange={(e) => setFormTahun(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={formSemester} onValueChange={(val) => setFormSemester(val || "")}>
                  <SelectTrigger><SelectValue placeholder="Pilih semester" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Batal</Button>
              <Button className="bg-navy-500 hover:bg-navy-600" onClick={handleCreate} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Buat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        {academicYears.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Belum ada data tahun ajaran. Silakan buat baru.
          </div>
        ) : (
          academicYears.map((ta) => (
            <Card
              key={ta.id}
              className={`transition-all duration-300 hover:shadow-lg ${
                ta.isActive ? "border-emerald-200 ring-1 ring-emerald-100" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ta.tahunAjaran}</CardTitle>
                  <Badge
                    className={
                      ta.isActive
                        ? "bg-emerald-100 text-emerald-700 gap-1"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {ta.isActive && <CheckCircle2 className="h-3 w-3" />}
                    {ta.isActive ? "Aktif" : "Selesai"}
                  </Badge>
                </div>
                <CardDescription>
                  Semester {ta.semester}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {/* Placeholder for future student association count */}
                    <span className="text-muted-foreground">Periode Terdaftar</span>
                  </div>
                  {ta.isActive ? (
                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-navy-600" onClick={() => handleArsip(ta)}>
                      <Archive className="h-3.5 w-3.5" /> Arsipkan
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleActivate(ta)}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Jadikan Aktif
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
