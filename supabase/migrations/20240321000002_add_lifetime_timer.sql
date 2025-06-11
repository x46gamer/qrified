-- Create a table to store the lifetime offer timer
CREATE TABLE IF NOT EXISTS lifetime_offer_timer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial timer (7 days from now)
INSERT INTO lifetime_offer_timer (end_date)
VALUES (NOW() + INTERVAL '7 days');

-- Add RLS policies
ALTER TABLE lifetime_offer_timer ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the timer
CREATE POLICY "Anyone can read the timer"
ON lifetime_offer_timer FOR SELECT
TO public
USING (true);

-- Only allow authenticated users with admin role to update the timer
CREATE POLICY "Only admins can update the timer"
ON lifetime_offer_timer FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Create a function to get the current timer end date
CREATE OR REPLACE FUNCTION get_lifetime_timer_end_date()
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN (SELECT end_date FROM lifetime_offer_timer ORDER BY created_at DESC LIMIT 1);
END;
$$; 