export type PraPendaftaran = {
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
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      pra_pendaftaran: {
        Row: PraPendaftaran;
        Insert: Omit<PraPendaftaran, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PraPendaftaran, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};