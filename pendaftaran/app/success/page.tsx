"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Submission = {
  id: string;
  nama: string;
  nim: string;
  status: string;
  minat: string;
  created_at: string;
};

export default function SuccessPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minatFilter, setMinatFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      let query = supabase
        .from("pra_pendaftaran")
        .select("id, nama, nim, status, minat, created_at")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (minatFilter && minatFilter !== "all") {
        query = query.eq("minat", minatFilter);
      }

      const { data, error } = await query;

      if (!error && data) {
        if (searchQuery) {
          const filtered = data.filter(
            (item) =>
              item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.nim.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSubmissions(filtered);
        } else {
          setSubmissions(data);
        }
      }
      setIsLoading(false);
    };

    fetchSubmissions();
  }, [searchQuery, statusFilter, minatFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <main className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-green-600">
              Form Berhasil Dikirim! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Terima kasih telah mengisi form pra-pendaftaran KKL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Link href="/">
                <Button variant="outline" className="mx-auto">
                  Kembali ke Halaman Utama
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Daftar Mahasiswa yang Sudah Mendaftar
              </h3>

              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sm:w-64"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="sm:w-48">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="aktif_kuliah">Aktif Kuliah</SelectItem>
                    <SelectItem value="aktif_pembayaran">
                      Aktif Pembayaran
                    </SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={minatFilter} onValueChange={setMinatFilter}>
                  <SelectTrigger className="sm:w-48">
                    <SelectValue placeholder="Filter Minat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Minat</SelectItem>
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

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Minat</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <span className="animate-spin mr-2">⏳</span>
                            Memuat data...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Tidak ada data yang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>{submission.nama}</TableCell>
                          <TableCell>{submission.nim}</TableCell>
                          <TableCell>
                            {submission.status === "aktif_kuliah"
                              ? "Aktif Kuliah"
                              : submission.status === "aktif_pembayaran"
                              ? "Aktif Pembayaran"
                              : "Cuti"}
                          </TableCell>
                          <TableCell>
                            {submission.minat === "sangat_berminat"
                              ? "Sangat Berminat"
                              : submission.minat === "berminat"
                              ? "Berminat"
                              : submission.minat === "ragu"
                              ? "Masih Ragu"
                              : "Tidak Berminat"}
                          </TableCell>
                          <TableCell>
                            {new Date(submission.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
