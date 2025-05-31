"use client";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/types/schema";
import { ChangeEvent } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nim: "",
    status: "",
    minat: "",
    alasan: "",
    kendala_finansial: "",
    bulan_menabung: "",
    nomor_wa: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("pra_pendaftaran")
        .insert([formData]);

      if (error) {
        if (error.code === "23505") {
          if (error.message.includes("nim")) {
            alert("NIM sudah terdaftar");
          } else {
            alert("Data sudah terdaftar");
          }
          return;
        }
        throw error;
      }

      router.push("/success");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <main className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">
                Pra-Pendaftaran KKL
              </CardTitle>
              <CardDescription>
                Silakan lengkapi form berikut untuk melakukan pra-pendaftaran
                KKL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Nama Lengkap */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nama" className="text-sm font-medium">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="nama"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange("nama", e.target.value)
                      }
                      className="w-full"
                      required
                    />
                  </div>

                  {/* NIM */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nim" className="text-sm font-medium">
                      NIM
                    </Label>
                    <Input
                      id="nim"
                      type="text"
                      placeholder="Masukkan NIM"
                      value={formData.nim}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange("nim", e.target.value)
                      }
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Status Mahasiswa */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Status Mahasiswa
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif_kuliah">
                          Aktif kuliah
                        </SelectItem>
                        <SelectItem value="aktif_pembayaran">
                          Aktif pembayaran saja
                        </SelectItem>
                        <SelectItem value="cuti">Cuti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Minat KKL */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Apakah kamu berminat mengikuti KKL?
                    </Label>
                    <Select
                      value={formData.minat}
                      onValueChange={(value) => handleChange("minat", value)}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Tingkat Minat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sangat_berminat">
                          Sangat Berminat
                        </SelectItem>
                        <SelectItem value="berminat">Berminat</SelectItem>
                        <SelectItem value="ragu">Masih Ragu</SelectItem>
                        <SelectItem value="tidak_berminat">
                          Tidak Berminat
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alasan */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="alasan" className="text-sm font-medium">
                      Alasan jika masih ragu/tidak berminat
                    </Label>
                    <Textarea
                      id="alasan"
                      placeholder="Tuliskan alasan anda"
                      value={formData.alasan}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleChange("alasan", e.target.value)
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Kendala Finansial */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium">
                      Apakah kamu memiliki kendala finansial jika ikut KKL?
                    </Label>
                    <RadioGroup
                      value={formData.kendala_finansial}
                      onValueChange={(value) =>
                        handleChange("kendala_finansial", value)
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ya" id="ya" />
                        <Label htmlFor="ya">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tidak" id="tidak" />
                        <Label htmlFor="tidak">Tidak</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Bulan Mulai Menabung */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Kalau ikut, kamu siap mulai menabung dari bulan...?
                    </Label>
                    <Select
                      value={formData.bulan_menabung}
                      onValueChange={(value) =>
                        handleChange("bulan_menabung", value)
                      }
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Januari</SelectItem>
                        <SelectItem value="2">Februari</SelectItem>
                        <SelectItem value="3">Maret</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">Mei</SelectItem>
                        <SelectItem value="6">Juni</SelectItem>
                        <SelectItem value="7">Juli</SelectItem>
                        <SelectItem value="8">Agustus</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">Oktober</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">Desember</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nomor WA */}
                  <div className="space-y-2">
                    <Label htmlFor="nomor_wa" className="text-sm font-medium">
                      Nomor WA Aktif
                    </Label>
                    <Input
                      id="nomor_wa"
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={formData.nomor_wa}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange("nomor_wa", e.target.value)
                      }
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Form"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
