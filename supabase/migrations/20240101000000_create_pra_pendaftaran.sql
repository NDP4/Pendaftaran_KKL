-- Create the pra_pendaftaran table
CREATE TABLE pra_pendaftaran (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nama TEXT NOT NULL,
    nim TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    minat TEXT NOT NULL,
    alasan TEXT,
    kendala_finansial TEXT NOT NULL,
    bulan_menabung TEXT NOT NULL,
    nomor_wa TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_pra_pendaftaran_nim ON pra_pendaftaran(nim);
CREATE INDEX idx_pra_pendaftaran_status ON pra_pendaftaran(status);
CREATE INDEX idx_pra_pendaftaran_minat ON pra_pendaftaran(minat);

-- Add row level security (RLS) policies
ALTER TABLE pra_pendaftaran ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public insert
CREATE POLICY "Allow public insert" ON pra_pendaftaran
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create a policy that allows public select
CREATE POLICY "Allow public select" ON pra_pendaftaran
    FOR SELECT
    TO public
    USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pra_pendaftaran_updated_at
    BEFORE UPDATE ON pra_pendaftaran
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();