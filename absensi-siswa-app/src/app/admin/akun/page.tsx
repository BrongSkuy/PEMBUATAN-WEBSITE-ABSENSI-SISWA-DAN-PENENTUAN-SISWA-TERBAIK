"use client";

import { useState } from "react";
import { UserCog, Search, KeyRound, Ban, CheckCircle2, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/lib/mock-data";

const akun = [
  { id: "1", username: "admin001", nama: "Drs. Haryanto, M.Pd", role: "ADMIN", status: "aktif" },
  { id: "2", username: "197601012005", nama: "Sri Mulyani, S.Pd", role: "GURU", status: "aktif" },
  { id: "3", username: "197805032006", nama: "Ahmad Fauzi, M.Pd", role: "GURU", status: "aktif" },
  { id: "4", username: "198203152008", nama: "Ratna Dewi, S.Pd", role: "GURU", status: "aktif" },
  { id: "5", username: "198507212010", nama: "Budi Santoso, S.Pd", role: "GURU", status: "nonaktif" },
  { id: "6", username: "2024001", nama: "Andi Pratama", role: "SISWA", status: "aktif" },
  { id: "7", username: "2024002", nama: "Siti Nurhaliza", role: "SISWA", status: "aktif" },
  { id: "8", username: "2024003", nama: "Rizky Maulana", role: "SISWA", status: "aktif" },
];

export default function AdminAkunPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filtered = akun.filter((a) => {
    const matchSearch = a.nama.toLowerCase().includes(search.toLowerCase()) || a.username.includes(search);
    const matchRole = filterRole === "all" || a.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen Akun" description="Kelola akun pengguna dan hak akses" icon={UserCog} />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama atau username..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterRole} onValueChange={(val) => setFilterRole(val as string)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="GURU">Guru</SelectItem>
                <SelectItem value="SISWA">Siswa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">No</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a, i) => (
                <TableRow key={a.id}>
                  <TableCell className="pl-6 text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-mono text-sm">{a.username}</TableCell>
                  <TableCell className="font-medium">{a.nama}</TableCell>
                  <TableCell>
                    <Badge className={
                      a.role === "ADMIN" ? "bg-navy-500 text-white" :
                      a.role === "GURU" ? "bg-amber-500 text-navy-950" :
                      "bg-emerald-500 text-white"
                    }>
                      {a.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={a.status === "aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                      {a.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs text-navy-600 hover:bg-navy-50">
                        <KeyRound className="h-3.5 w-3.5" /> Reset Password
                      </Button>
                      {a.status === "aktif" ? (
                        <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs text-red-500 hover:bg-red-50">
                          <Ban className="h-3.5 w-3.5" /> Nonaktifkan
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs text-emerald-600 hover:bg-emerald-50">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Aktifkan
                        </Button>
                      )}
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
