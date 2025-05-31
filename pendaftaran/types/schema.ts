export interface Submission {
  id: string;
  nama: string;
  nim: string;
  status: string;
  minat: string;
  alasan?: string;
  kendala_finansial: string;
  bulan_menabung: string;
  nomor_wa: string;
  created_at: string;
}

export interface FormData {
  nama: string;
  nim: string;
  status: string;
  minat: string;
  alasan: string;
  kendala_finansial: string;
  bulan_menabung: string;
  nomor_wa: string;
}