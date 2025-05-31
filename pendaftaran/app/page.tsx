"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import jsPDF from "jspdf";
export default function Home() {
  const downloadSurat = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const lineHeight = 7;
    let cursorY = 20;

    // Header
    doc.setFontSize(12);
    doc.text("PANITIA KKL D3-Teknik Informatika", pageWidth / 2, cursorY, {
      align: "center",
    });
    cursorY += lineHeight;
    doc.text("Universitas Dian Nuswantoro", pageWidth / 2, cursorY, {
      align: "center",
    });
    cursorY += lineHeight;
    doc.text("Angkatan 2023", pageWidth / 2, cursorY, { align: "center" });
    cursorY += lineHeight * 2;

    // Tanggal
    doc.setFont("helvetica", "normal");
    doc.text(
      `Semarang, ${new Date().toLocaleDateString("id-ID")}`,
      20,
      cursorY
    );
    cursorY += lineHeight * 2;

    // Penerima
    doc.text("Kepada Yth.", 20, cursorY);
    cursorY += lineHeight;
    doc.text("Orang Tua/Wali Mahasiswa", 20, cursorY);
    cursorY += lineHeight;
    doc.text("di Tempat", 20, cursorY);
    cursorY += lineHeight * 2;

    // Perihal
    doc.text(
      "Perihal: Informasi Awal Kegiatan Kuliah Kerja Lapangan (KKL) 2023",
      20,
      cursorY
    );
    cursorY += lineHeight * 2;

    // Pembuka
    doc.text("Dengan hormat,", 20, cursorY);
    cursorY += lineHeight * 2;

    // Paragraf 1
    const paragraf1 =
      "Sehubungan dengan agenda akademik Program Studi D3-Teknik Informatika Universitas Dian Nuswantoro, " +
      "kami selaku panitia tengah mempersiapkan kegiatan Kuliah Kerja Lapangan (KKL) yang rencananya akan " +
      "dilaksanakan pada Januari 2025.";
    const splitP1 = doc.splitTextToSize(paragraf1, pageWidth - 40);
    doc.text(splitP1, 20, cursorY);
    cursorY += splitP1.length * lineHeight + lineHeight;

    // Paragraf 2
    const paragraf2 =
      "KKL ini bersifat tidak wajib, namun sangat dianjurkan untuk diikuti karena memberikan manfaat " +
      "nyata dalam pembekalan dunia kerja dan pengalaman profesional.";
    const splitP2 = doc.splitTextToSize(paragraf2, pageWidth - 40);
    doc.text(splitP2, 20, cursorY);
    cursorY += splitP2.length * lineHeight + lineHeight;

    // Informasi Poin
    doc.text("Berikut kami sampaikan informasi awal:", 20, cursorY);
    cursorY += lineHeight;
    doc.text("- Perkiraan Waktu Pelaksanaan: Januari 2026", 25, cursorY);
    cursorY += lineHeight;
    doc.text("- Perkiraan Tujuan: Bali", 25, cursorY);
    cursorY += lineHeight;
    doc.text("- Estimasi Biaya: Rp1.950.000 s/d Rp2.100.000", 25, cursorY);
    cursorY += lineHeight;
    doc.text(
      "  (sudah termasuk transportasi, penginapan, konsumsi, dan perlengkapan dll)",
      25,
      cursorY
    );
    cursorY += lineHeight;
    doc.text(
      "- Sistem Pembayaran: Bisa dicicil selama 3–5 bulan dengan cara menabung",
      25,
      cursorY
    );
    cursorY += lineHeight;
    doc.text(
      "- Surat resmi dari kampus akan dikeluarkan 1 bulan sebelum open tender biro perjalanan",
      25,
      cursorY
    );
    cursorY += lineHeight * 2;

    // Paragraf Kontak
    const paragrafKontak =
      "Kami mohon Bapak/Ibu dapat mempertimbangkan dan mendukung putra/putrinya untuk mengikuti " +
      "kegiatan ini. Jika Bapak/Ibu memiliki pertanyaan lebih lanjut, dapat menghubungi kami melalui kontak berikut:";
    const splitPK = doc.splitTextToSize(paragrafKontak, pageWidth - 40);
    doc.text(splitPK, 20, cursorY);
    cursorY += splitPK.length * lineHeight + lineHeight;

    doc.text("Nama Ketua Panitia: [Nama]", 20, cursorY);
    cursorY += lineHeight;
    doc.text("No. HP/WA: [Nomor]", 20, cursorY);
    cursorY += lineHeight * 2;

    // Penutup
    const penutup =
      "Demikian informasi awal ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.";
    const splitPenutup = doc.splitTextToSize(penutup, pageWidth - 40);
    doc.text(splitPenutup, 20, cursorY);
    cursorY += splitPenutup.length * lineHeight + lineHeight * 2;

    // Tanda tangan
    doc.text("Hormat kami,", 20, cursorY);
    cursorY += lineHeight;
    doc.text("Panitia KKL 2023", 20, cursorY);
    cursorY += lineHeight;
    doc.text("D3-Teknik Informatika UDINUS", 20, cursorY);

    doc.save("surat-informasi-kkl.pdf");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Kuliah Kerja Lapangan 2023
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Program pengalaman lapangan untuk mahasiswa D3 Teknik Informatika
              UDINUS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                asChild
              >
                <Link href="/pendaftaran">Daftar Sekarang</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={downloadSurat}
              >
                Download Surat Informasi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Waktu Pelaksanaan
                </h3>
                <p className="text-gray-600">
                  Direncanakan pada Januari 2026 dengan durasi kunjungan yang
                  telah disesuaikan
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Tujuan Kunjungan</h3>
                <p className="text-gray-600">
                  Bali, PT.Timedoor Indonesia
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Investasi</h3>
                <p className="text-gray-600">
                  Rp1.950.000 - Rp2.100.000 dengan sistem cicilan selama 3-5
                  bulan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Manfaat KKL</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-lg h-fit">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pengalaman Industri</h3>
                <p className="text-gray-600">
                  Melihat langsung proses kerja di perusahaan teknologi
                  terkemuka
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-lg h-fit">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Networking</h3>
                <p className="text-gray-600">
                  Membangun relasi dengan profesional dan sesama mahasiswa
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-lg h-fit">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wawasan Industri</h3>
                <p className="text-gray-600">
                  Memahami tren dan kebutuhan industri teknologi terkini
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-lg h-fit">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Persiapan Karir</h3>
                <p className="text-gray-600">
                  Mempersiapkan diri untuk dunia kerja profesional
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Bergabung?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Jangan lewatkan kesempatan untuk mendapatkan pengalaman berharga
            ini. Daftarkan diri Anda sekarang!
          </p>
          <Button size="lg" asChild>
            <Link href="/pendaftaran">Daftar KKL Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
