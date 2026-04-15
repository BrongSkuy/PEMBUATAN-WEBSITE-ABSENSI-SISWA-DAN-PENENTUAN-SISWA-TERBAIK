"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { PenLine, Save, Loader2, BookOpen, Trash2, Upload, Download } from "lucide-react";
import { toast } from "sonner";
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface KelasRow { id: string; namaKelas: string; }
interface MapelRow { namaMapel: string; }
interface CriteriaRow { id: string; namaKriteria: string; bobot: number; tipe: string; deskripsi: string; }
interface ScoreStudent { studentId: string; nis: string; namaLengkap: string; nilai: number; scoreId: string | null; }

export default function GuruNilaiPage() {
  const [classes, setClasses] = useState<KelasRow[]>([]);
  const [subjects, setSubjects] = useState<MapelRow[]>([]);
  const [criteria, setCriteria] = useState<CriteriaRow[]>([]);
  
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("Umum");
  const [selectedCriteria, setSelectedCriteria] = useState("");
  
  const [siswaList, setSiswaList] = useState<ScoreStudent[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  
  const [showGrid, setShowGrid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then(r => r.json()),
      fetch("/api/teachers/me/subjects").then(r => r.json()),
      fetch("/api/spk/criteria").then(r => r.json()),
    ]).then(([classesData, subjectsData, criteriaData]) => {
      setClasses(classesData);
      if (classesData.length > 0) setSelectedKelas(classesData[0].namaKelas);
      
      const manualCriteria = criteriaData.filter((c: CriteriaRow) => c.tipe === "Manual" || c.namaKriteria === "Nilai Akademik");
      setCriteria(manualCriteria);
      if (manualCriteria.length > 0) setSelectedCriteria(manualCriteria[0].id);

      if (Array.isArray(subjectsData) && subjectsData.length > 0) {
        setSubjects(subjectsData);
        setSelectedMapel(subjectsData[0].namaMapel);
      }
    }).catch(() => toast.error("Gagal memuat preferensi guru"));
  }, []);

  const handleLoad = useCallback(async () => {
    if (!selectedKelas || !selectedCriteria) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spk/scores?kelas=${encodeURIComponent(selectedKelas)}&criteriaId=${encodeURIComponent(selectedCriteria)}&mapel=${encodeURIComponent(selectedMapel)}`);
      if (!res.ok) throw new Error("Gagal load nilai");
      const data: ScoreStudent[] = await res.json();
      setSiswaList(data);
      
      const init: Record<string, number> = {};
      data.forEach((s) => { init[s.studentId] = s.nilai || 0; });
      setScores(init);
      setShowGrid(true);
    } catch {
      toast.error("Gagal memuat grid nilai");
    } finally {
      setLoading(false);
    }
  }, [selectedKelas, selectedCriteria, selectedMapel]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = Object.entries(scores).map(([studentId, nilai]) => ({
        studentId,
        nilai,
      }));

      const res = await fetch("/api/spk/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteriaId: selectedCriteria, mapel: selectedMapel, records }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      toast.success("Nilai berhasil disimpan!");
      handleLoad();
    } catch {
      toast.error("Gagal menyimpan nilai");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/spk/scores?kelas=${encodeURIComponent(selectedKelas)}&criteriaId=${encodeURIComponent(selectedCriteria)}&mapel=${encodeURIComponent(selectedMapel)}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Gagal hapus");
      toast.success("Data nilai berhasil dihapus");
      handleLoad(); // clear grid
      setDeleteOpen(false);
    } catch {
      toast.error("Gagal menghapus nilai");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Input Nilai Kriteria & Akademik" description="Input nilai numerik kinerja siswa berdasarkan Mapel dan kriteria lainnya" icon={PenLine} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pengaturan Sesi Penilaian</CardTitle>
          <CardDescription>Pilih target kelas, mapel (bila diperlukan), dan kriteria spesifik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
            <div className="space-y-2 flex-1 max-w-xs">
              <Label>Target Kelas</Label>
              <Select value={selectedKelas} onValueChange={(val: string | null) => val && setSelectedKelas(val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classes.map((k) => (
                    <SelectItem key={k.id} value={k.namaKelas}>{k.namaKelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1 max-w-sm">
              <Label>Mata Pelajaran (Isikan Umum untuk Non-Akademik)</Label>
              <Select value={selectedMapel} onValueChange={(val: string | null) => val && setSelectedMapel(val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Umum">Umum / Semua Mapel</SelectItem>
                  {subjects.map((s, i) => (
                    <SelectItem key={i} value={s.namaMapel}>{s.namaMapel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1 max-w-md">
              <Label>Pilih Kriteria Penilaian</Label>
              <Select value={selectedCriteria} onValueChange={(val: string | null) => val && setSelectedCriteria(val)}>
                <SelectTrigger className="w-full xl:min-w-[300px]">
                  <span className="line-clamp-1 truncate">
                    {criteria.find(c => c.id === selectedCriteria)
                      ? `${criteria.find(c => c.id === selectedCriteria)!.namaKriteria} (Bobot: ${criteria.find(c => c.id === selectedCriteria)!.bobot}%)`
                      : "Pilih Kriteria..."}
                  </span>
                </SelectTrigger>
                <SelectContent className="max-w-[100vw] xl:max-w-2xl">
                  {criteria.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                       {c.namaKriteria} (Bobot: {c.bobot}%) - {c.deskripsi || "Tanpa deskripsi"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-navy-500 hover:bg-navy-600 w-full xl:w-auto h-10 gap-2 shrink-0" onClick={handleLoad} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />} Muat Data Tabel
            </Button>
            <input
              ref={importRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={async (e) => {
                 const file = e.target.files?.[0];
                 if (!file) return;
                 setImporting(true);
                 try {
                   const data = await file.arrayBuffer();
                   const workbook = XLSX.read(data);
                   const sheet = workbook.Sheets[workbook.SheetNames[0]];
                   const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet);
                   
                   if (rows.length === 0) {
                     toast.error("File excel kosong");
                     return;
                   }

                   let matchCount = 0;
                   setScores((prev) => {
                     const next = { ...prev };
                     rows.forEach(row => {
                        const rowNis = String(row.NIS || row.nis || "").trim();
                        const rowNilai = parseFloat(String(row.Nilai || row.nilai || row.Skor || 0));
                        
                        if (rowNis && !isNaN(rowNilai)) {
                           // Find student in siswaList that matches NIS
                           const matchedStudent = siswaList.find(s => s.nis === rowNis);
                           if (matchedStudent) {
                              next[matchedStudent.studentId] = rowNilai;
                              matchCount++;
                           }
                        }
                     });
                     return next;
                   });

                   if (matchCount > 0) {
                      toast.success(`Berhasil mengimpor ${matchCount} nilai siswa. Silakan klik 'Simpan Record Nilai' jika sudah benar.`);
                   } else {
                      toast.warning("Tidak ada NIS yang cocok dengan daftar di kelas ini.");
                   }
                 } catch (err) {
                   toast.error("Gagal membaca file excel");
                 } finally {
                   setImporting(false);
                   if (importRef.current) importRef.current.value = "";
                 }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {showGrid && (
        <>
          <div className="flex justify-end gap-2 items-center">
             <Button variant="outline" className="border-navy-200 text-navy-600 hover:bg-navy-50" onClick={() => {
                 const templateData = siswaList.map(s => ({
                    NIS: s.nis,
                    NamaLengkap: s.namaLengkap,
                    Nilai: scores[s.studentId] || 0
                 }));
                 if (templateData.length === 0) return toast.error("Tidak ada siswa");
                 const ws = XLSX.utils.json_to_sheet(templateData);
                 const wb = XLSX.utils.book_new();
                 XLSX.utils.book_append_sheet(wb, ws, "Format Nilai");
                 XLSX.writeFile(wb, `Template_Nilai_${selectedKelas}_${selectedMapel}.xlsx`);
             }}>
                 <Download className="h-4 w-4 gap-2 mr-2" /> Download Template
             </Button>
             <Button variant="outline" className="border-amber-200 text-amber-600 hover:bg-amber-50" disabled={importing} onClick={() => importRef.current?.click()}>
                 {importing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 gap-2 mr-2" />} Import Excel
             </Button>
             <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                   <AlertDialogTrigger render={
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" disabled={deleting}>
                         {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Trash2 className="h-4 w-4 mr-2" />} Hapus Spesifik
                      </Button>
                   } />
                   <AlertDialogContent>
                      <AlertDialogHeader>
                         <AlertDialogTitle>Hapus Data Penilaian?</AlertDialogTitle>
                         <AlertDialogDescription>
                            Menghapus seluruh nilai pada kelas <b>{selectedKelas}</b>, mapel <b>{selectedMapel}</b>, untuk kriteria ini. 
                         </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                         <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                         <AlertDialogAction disabled={deleting} onClick={(e) => { e.preventDefault(); handleDelete(); }} className="bg-red-600 hover:bg-red-700 text-white">
                            {deleting ? "Menghapus..." : "Ya, Hapus"}
                         </AlertDialogAction>
                      </AlertDialogFooter>
                   </AlertDialogContent>
             </AlertDialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="border-b bg-muted/50">
                       <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">No</th>
                       <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-24">NIS</th>
                       <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nama Siswa</th>
                       <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground w-32">Skor Nilai (0-100)</th>
                     </tr>
                   </thead>
                   <tbody>
                     {siswaList.length === 0 ? (
                       <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">Tidak ada data</td></tr>
                     ) : siswaList.map((siswa, i) => (
                       <tr key={siswa.studentId} className="border-b transition-colors hover:bg-muted/30">
                         <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                         <td className="px-4 py-3 font-mono text-sm">{siswa.nis}</td>
                         <td className="px-4 py-3 text-sm font-medium">{siswa.namaLengkap}</td>
                         <td className="px-4 py-3">
                           <div className="flex justify-center">
                             <Input
                               type="number"
                               min={0}
                               max={100}
                               value={scores[siswa.studentId] !== undefined ? scores[siswa.studentId] : ""}
                               onChange={(e) =>
                                 setScores((p) => ({
                                   ...p,
                                   [siswa.studentId]: parseFloat(e.target.value) || 0,
                                 }))
                               }
                               className={`w-20 text-center font-semibold ${scores[siswa.studentId] > 0 ? "border-amber-400 bg-amber-50" : ""}`}
                             />
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="gap-2 bg-navy-500 hover:bg-navy-600 shadow-lg shadow-navy-500/20" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} Simpan Record Nilai
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
