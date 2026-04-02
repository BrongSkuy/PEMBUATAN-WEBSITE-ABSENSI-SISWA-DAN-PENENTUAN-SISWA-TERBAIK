"use client";

import { useState } from "react";
import { GraduationCap, Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockTeachers } from "@/lib/mock-data";

export default function AdminGuruPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = mockTeachers.filter(
    (t) =>
      t.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.includes(search)
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Data Guru" description="Kelola data guru dan staff pengajar" icon={GraduationCap}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2 bg-navy-500 hover:bg-navy-600" />}>
              <Plus className="h-4 w-4" /> Tambah Guru
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Guru Baru</DialogTitle>
              <DialogDescription>Isi data guru yang akan didaftarkan</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" placeholder="Contoh: 199012012012" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama-guru">Nama Lengkap</Label>
                <Input id="nama-guru" placeholder="Masukkan nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapel-guru">Mata Pelajaran</Label>
                <Input id="mapel-guru" placeholder="Contoh: Matematika" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button className="bg-navy-500 hover:bg-navy-600" onClick={() => { setDialogOpen(false); toast.success("Data guru berhasil ditambahkan!"); }}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama atau NIP..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">No</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas Diampu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((guru, i) => (
                <TableRow key={guru.id}>
                  <TableCell className="pl-6 text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-mono text-sm">{guru.nip}</TableCell>
                  <TableCell className="font-medium">{guru.namaLengkap}</TableCell>
                  <TableCell>{guru.mapel.join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {guru.kelasDiampu.map((k) => (
                        <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={guru.status === "aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                      {guru.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-navy-500 hover:bg-navy-50" aria-label={`Edit ${guru.namaLengkap}`} onClick={() => toast.info(`Mengedit data ${guru.namaLengkap}...`)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" aria-label={`Hapus ${guru.namaLengkap}`} onClick={() => toast.success(`Data ${guru.namaLengkap} berhasil dihapus!`)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
