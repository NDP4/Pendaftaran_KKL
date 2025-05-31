"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  alasan: string;
  kendala_finansial: string;
  bulan_menabung: string;
  nomor_wa: string;
  created_at: string;
};

export default function AdminDataPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [minatFilter, setMinatFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const filterSubmissions = useCallback(() => {
    let result = [...submissions];

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nim.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (minatFilter && minatFilter !== "all") {
      result = result.filter((item) => item.minat === minatFilter);
    }

    setFilteredSubmissions(result);
  }, [submissions, searchQuery, minatFilter]);

  useEffect(() => {
    filterSubmissions();
  }, [filterSubmissions]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pra_pendaftaran")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSubmissions(data);
        setFilteredSubmissions(data);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "aktif_kuliah":
        return "Aktif Kuliah";
      case "aktif_pembayaran":
        return "Aktif Pembayaran";
      case "cuti":
        return "Cuti";
      default:
        return status;
    }
  };

  const formatMinat = (minat: string) => {
    switch (minat) {
      case "sangat_berminat":
        return "Sangat Berminat";
      case "berminat":
        return "Berminat";
      case "ragu":
        return "Masih Ragu";
      case "tidak_berminat":
        return "Tidak Berminat";
      default:
        return minat;
    }
  };

  const formatKendalaFinansial = (kendala: string) => {
    return kendala === "ya" ? "Ya" : "Tidak";
  };
  const generatePDF = () => {
    const doc = new jsPDF("landscape");

    // Add title
    doc.setFontSize(18);
    doc.text("Data Pendaftaran KKL", doc.internal.pageSize.width / 2, 20, {
      align: "center",
    });

    // Add subtitle with date
    doc.setFontSize(12);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`,
      doc.internal.pageSize.width / 2,
      30,
      { align: "center" }
    );

    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Nama",
          "NIM",
          "Status",
          "Minat",
          "Alasan",
          "Kendala Finansial",
          "Bulan Menabung",
          "Nomor WA",
          "Tanggal Daftar",
        ],
      ],
      body: filteredSubmissions.map((item) => [
        item.nama,
        item.nim,
        formatStatus(item.status),
        formatMinat(item.minat),
        item.alasan || "-",
        formatKendalaFinansial(item.kendala_finansial),
        item.bulan_menabung || "-",
        item.nomor_wa,
        new Date(item.created_at).toLocaleDateString("id-ID"),
      ]),
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        fontSize: 9,
        cellPadding: 3,
        halign: "left",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 45 }, // Nama
        1: { cellWidth: 25 }, // NIM
        2: { cellWidth: 30 }, // Status
        3: { cellWidth: 30 }, // Minat
        4: { cellWidth: 60 }, // Alasan
        5: { cellWidth: 25 }, // Kendala Finansial
        6: { cellWidth: 25 }, // Bulan Menabung
        7: { cellWidth: 30 }, // Nomor WA
        8: { cellWidth: 30 }, // Tanggal Daftar
      },
      margin: { top: 40, left: 15, right: 15 },
      didDrawPage: function (data) {
        // Add page number at the bottom
        doc.setFontSize(8);
        doc.text(
          `Halaman ${data.pageNumber}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save("pendaftaran-kkl.pdf");
  };

  const generateExcel = () => {
    const wsColumns = [
      { wch: 30 }, // Nama
      { wch: 15 }, // NIM
      { wch: 20 }, // Status
      { wch: 20 }, // Minat
      { wch: 50 }, // Alasan
      { wch: 20 }, // Kendala Finansial
      { wch: 20 }, // Bulan Menabung
      { wch: 15 }, // Nomor WA
      { wch: 20 }, // Tanggal Daftar
    ];

    const ws = XLSX.utils.json_to_sheet(
      filteredSubmissions.map((item) => ({
        Nama: item.nama,
        NIM: item.nim,
        Status: formatStatus(item.status),
        Minat: formatMinat(item.minat),
        Alasan: item.alasan || "-",
        "Kendala Finansial": formatKendalaFinansial(item.kendala_finansial),
        "Bulan Menabung": item.bulan_menabung || "-",
        "Nomor WA": item.nomor_wa,
        "Tanggal Daftar": new Date(item.created_at).toLocaleDateString("id-ID"),
      }))
    );

    ws["!cols"] = wsColumns;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pendaftaran KKL");
    XLSX.writeFile(wb, "pendaftaran-kkl.xlsx");
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Data Pendaftaran KKL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Cari nama atau NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-64"
            />
            <Select value={minatFilter} onValueChange={setMinatFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter Minat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="sangat_berminat">Sangat Berminat</SelectItem>
                <SelectItem value="berminat">Berminat</SelectItem>
                <SelectItem value="ragu">Masih Ragu</SelectItem>
                <SelectItem value="tidak_berminat">Tidak Berminat</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={generatePDF}>Download PDF</Button>
              <Button onClick={generateExcel}>Download Excel</Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Minat</TableHead>
                  <TableHead>Kendala Finansial</TableHead>
                  <TableHead>Nomor WA</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.nim}</TableCell>
                      <TableCell>{formatStatus(item.status)}</TableCell>
                      <TableCell>{formatMinat(item.minat)}</TableCell>
                      <TableCell>
                        {formatKendalaFinansial(item.kendala_finansial)}
                      </TableCell>
                      <TableCell>{item.nomor_wa}</TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
