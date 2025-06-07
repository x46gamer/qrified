-- Add show_logo column to qr_codes table
ALTER TABLE qr_codes
ADD COLUMN show_logo BOOLEAN DEFAULT false; 