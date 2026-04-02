"use client";

import { useState } from "react";
import { School, Plus, Edit, Trash2 } from "lucide-react";
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockKelas, mockTeachers } from "@/lib/mock-data";

export default function AdminKelasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Data Kelas" description="Kelola data kelas dan pembagian wali kelas" icon={School}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2 bg-navy-500 hover:bg-navy-600" />}>
              <Plus className="h-4 w-4" /> Tambah Kelas
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
              <DialogDescription>Isi informasi kelas yang akan dibuat</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama-kelas">Nama Kelas</Label>
                  <Input id="nama-kelas" placeholder="Contoh: X-C" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tingkat">Tingkat</Label>
                  <Select>
                    <SelectTrigger id="tingkat"><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="11">11</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wali">Wali Kelas</Label>
                <Select>
                  <SelectTrigger id="wali"><SelectValue placeholder="Pilih guru" /></SelectTrigger>
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
              <Button className="bg-navy-500 hover:bg-navy-600" onClick={() => setDialogOpen(false)}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockKelas.map((kelas) => (
          <Card key={kelas.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-navy-700">{kelas.namaKelas}</h3>
                  <p className="text-sm text-muted-foreground">Tingkat {kelas.tingkat}</p>
                </div>
                <Badge className="bg-navy-100 text-navy-700">{kelas.jumlahSiswa} siswa</Badge>
              </div>
              <div className="mb-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Wali Kelas</p>
                <p className="text-sm font-medium">{kelas.waliKelas}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1 text-navy-600 hover:bg-navy-50">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
