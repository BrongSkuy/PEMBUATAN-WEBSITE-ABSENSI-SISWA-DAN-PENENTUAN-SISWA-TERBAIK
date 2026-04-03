"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Upload,
  Search,
  Edit,
  Trash2,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockStudents, mockKelas } from "@/lib/mock-data";

export default function AdminSiswaPage() {
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = mockStudents.filter((s) => {
    const matchSearch =
      s.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search);
    const matchKelas = filterKelas === "all" || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa yang terdaftar di sistem"
        icon={Users}
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-navy-200 text-navy-600 hover:bg-navy-50"
          onClick={() => toast.info("Fitur download template akan tersedia saat database aktif.")}
        >
          <Download className="h-4 w-4" />
          Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
          onClick={() => toast.info("Fitur import data akan tersedia saat database aktif.")}
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2 bg-navy-500 hover:bg-navy-600" />}>
              <Plus className="h-4 w-4" />
              Tambah Siswa
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
              <DialogDescription>
                Isi data siswa yang akan didaftarkan ke sistem
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS</Label>
                  <Input id="nis" placeholder="Contoh: 2024016" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jk">Jenis Kelamin</Label>
                  <Select>
                    <SelectTrigger id="jk">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" placeholder="Masukkan nama lengkap" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas</Label>
                  <Select>
                    <SelectTrigger id="kelas">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockKelas.map((k) => (
                        <SelectItem key={k.id} value={k.namaKelas}>
                          {k.namaKelas}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="angkatan">Angkatan</Label>
                  <Input id="angkatan" placeholder="2024" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-navy-500 hover:bg-navy-600"
                onClick={() => {
                  setDialogOpen(false);
                  toast.success("Data siswa berhasil ditambahkan!");
                }}
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIS..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterKelas} onValueChange={(val) => setFilterKelas(val as string)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {mockKelas.map((k) => (
                  <SelectItem key={k.id} value={k.namaKelas}>
                    {k.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">No</TableHead>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>JK</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((siswa, i) => (
                <TableRow key={siswa.id}>
                  <TableCell className="pl-6 text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {siswa.nis}
                  </TableCell>
                  <TableCell className="font-medium">
                    {siswa.namaLengkap}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{siswa.kelas}</Badge>
                  </TableCell>
                  <TableCell>{siswa.angkatan}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        siswa.jenisKelamin === "L"
                          ? "border-sky-200 bg-sky-50 text-sky-700"
                          : "border-pink-200 bg-pink-50 text-pink-700"
                      }
                    >
                      {siswa.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        siswa.status === "aktif"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {siswa.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-navy-500 hover:bg-navy-50 hover:text-navy-700"
                        aria-label={`Edit ${siswa.namaLengkap}`}
                        onClick={() => toast.info(`Mengedit data ${siswa.namaLengkap}...`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                        aria-label={`Hapus ${siswa.namaLengkap}`}
                        onClick={() => toast.success(`Data ${siswa.namaLengkap} berhasil dihapus!`)}
                      >
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
