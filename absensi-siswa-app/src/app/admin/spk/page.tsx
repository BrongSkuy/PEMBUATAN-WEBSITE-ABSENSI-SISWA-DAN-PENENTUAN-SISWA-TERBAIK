"use client";

import { useState } from "react";
import { Settings2, Save, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { mockSpkCriteria, type SpkCriteria } from "@/lib/mock-data";

export default function AdminSpkPage() {
  const [criteria, setCriteria] = useState<SpkCriteria[]>(mockSpkCriteria);
  const [saved, setSaved] = useState(false);

  const totalBobot = criteria.reduce((sum, c) => sum + c.bobot, 0);
  const isValid = totalBobot === 100;

  const updateBobot = (id: string, value: number) => {
    setSaved(false);
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, bobot: value } : c))
    );
  };

  const handleSave = () => {
    if (isValid) setSaved(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfigurasi SPK"
        description="Atur bobot persentase untuk setiap kriteria penilaian siswa terbaik"
        icon={Settings2}
      >
        <Button
          className="gap-2 bg-navy-500 hover:bg-navy-600"
          size="sm"
          disabled={!isValid}
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          Simpan Perubahan
        </Button>
      </PageHeader>

      {/* Total indicator */}
      <Card className={isValid ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}>
        <CardContent className="flex items-center gap-3 py-4">
          {isValid ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          )}
          <div>
            <p className={`text-sm font-semibold ${isValid ? "text-emerald-700" : "text-amber-700"}`}>
              Total Bobot: {totalBobot}%
            </p>
            <p className={`text-xs ${isValid ? "text-emerald-600" : "text-amber-600"}`}>
              {isValid ? "Bobot sudah valid (total = 100%)" : `Sisa ${100 - totalBobot}% lagi untuk mencapai 100%`}
            </p>
          </div>
          {saved && (
            <Badge className="ml-auto bg-emerald-500 text-white animate-fade-in">
              ✓ Tersimpan
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Criteria cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {criteria.map((c, index) => (
          <Card
            key={c.id}
            className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{c.namaKriteria}</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    c.tipe === "Otomatis"
                      ? "border-sky-200 bg-sky-50 text-sky-700"
                      : "border-purple-200 bg-purple-50 text-purple-700"
                  }
                >
                  {c.tipe}
                </Badge>
              </div>
              <CardDescription className="text-xs">{c.deskripsi}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={c.bobot}
                    onChange={(e) =>
                      updateBobot(c.id, parseInt(e.target.value) || 0)
                    }
                    className="h-12 text-center text-2xl font-bold text-navy-700 w-24"
                  />
                  <span className="text-lg font-semibold text-muted-foreground">
                    %
                  </span>
                </div>
                {/* Visual bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-navy-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.min(c.bobot, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info box */}
      <Card className="border-navy-100 bg-navy-50/50">
        <CardContent className="flex items-start gap-3 py-4">
          <Info className="h-5 w-5 text-navy-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-navy-700">
            <p className="font-semibold mb-1">Tentang Perhitungan SPK</p>
            <p className="text-navy-600">
              Sistem akan mengalikan nilai setiap kriteria dengan bobotnya, kemudian menjumlahkan
              hasilnya untuk mendapatkan skor akhir. Kriteria bertipe <strong>Otomatis</strong> dihitung
              langsung dari data sistem, sedangkan <strong>Manual</strong> diinput oleh guru.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
