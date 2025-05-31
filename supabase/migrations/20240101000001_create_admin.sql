-- Create admin table
CREATE TABLE admin (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default admin with hashed password (using pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO admin (username, password) 
VALUES ('adminkkl', crypt('adminkkl2023', gen_salt('bf')));

-- Enable RLS
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Create policy for admin table
CREATE POLICY select_admin ON admin FOR SELECT USING (true);