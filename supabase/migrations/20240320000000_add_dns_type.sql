-- Add dns_type column to custom_domains table
ALTER TABLE custom_domains
ADD COLUMN dns_type TEXT NOT NULL DEFAULT 'cname'
CHECK (dns_type IN ('cname', 'a', 'nameservers')); 