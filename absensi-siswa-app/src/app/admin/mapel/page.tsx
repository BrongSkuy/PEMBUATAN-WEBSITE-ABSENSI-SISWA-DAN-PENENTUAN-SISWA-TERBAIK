"use client";

import { useState } from "react";
import { BookOpen, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockMapel, mockTeachers } from "@/lib/mock-data";

export default function AdminMapelPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockMapel.filter(
    (m) => m.namaMapel.toLowerCase().includes(search.toLowerCase()) ||
           m.guruPengampu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Mata Pelajaran" description="Kelola daftar mata pelajaran dan guru pengampu" icon={BookOpen}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2 bg-navy-500 hover:bg-navy-600" />}>
              <Plus className="h-4 w-4" /> Tambah Mapel
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
              <DialogDescription>Isi data mata pelajaran baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama-mapel">Nama Mata Pelajaran</Label>
                <Input id="nama-mapel" placeholder="Contoh: Biologi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guru-mapel">Guru Pengampu</Label>
                <Select>
                  <SelectTrigger id="guru-mapel"><SelectValue placeholder="Pilih guru" /></SelectTrigger>
                  <SelectContent>
                    {mockTeachers.map((t) => (
                      <SelectItem key={t.id} value={t.namaLengkap}>{t.namaLengkap}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button className="bg-navy-500 hover:bg-navy-600" onClick={() => { setDialogOpen(false); toast.success("Mata pelajaran berhasil ditambahkan!"); }}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari mata pelajaran..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">No</TableHead>
                <TableHead>Nama Mata Pelajaran</TableHead>
                <TableHead>Guru Pengampu</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((mapel, i) => (
                <TableRow key={mapel.id}>
                  <TableCell className="pl-6 text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{mapel.namaMapel}</TableCell>
                  <TableCell>{mapel.guruPengampu}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-navy-500 hover:bg-navy-50" aria-label={`Edit ${mapel.namaMapel}`} onClick={() => toast.info(`Mengedit ${mapel.namaMapel}...`)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" aria-label={`Hapus ${mapel.namaMapel}`} onClick={() => toast.success(`${mapel.namaMapel} berhasil dihapus!`)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
