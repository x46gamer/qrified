-- Update the set_unlimited_qr_codes function to set 100k monthly limit for lifetime subscribers
CREATE OR REPLACE FUNCTION set_unlimited_qr_codes()
RETURNS trigger AS $$
BEGIN
  IF NEW.subscription_type = 'lifetime' AND NEW.subscription_status = 'active' THEN
    UPDATE user_limits
    SET 
      monthly_qr_limit = 100000, -- Set to 100k QR codes per month
      is_unlimited = false, -- Set to false since we have a specific limit
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing lifetime subscribers to have the new limit
UPDATE user_limits
SET monthly_qr_limit = 100000,
    is_unlimited = false,
    updated_at = NOW()
WHERE id IN (
  SELECT id 
  FROM user_profiles 
  WHERE subscription_type = 'lifetime' 
  AND subscription_status = 'active'
); 