-- Add logo_url column to qr_codes table
ALTER TABLE qr_codes
ADD COLUMN logo_url TEXT NULL; 