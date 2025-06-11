-- Add lifetime subscription fields to user_profiles
ALTER TABLE user_profiles
ADD COLUMN subscription_type TEXT DEFAULT 'none' CHECK (subscription_type IN ('none', 'monthly', 'annual', 'lifetime')),
ADD COLUMN subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'canceled')),
ADD COLUMN subscription_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;

-- Create a function to update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS trigger AS $$
BEGIN
  -- For lifetime subscriptions, set ends_at to a far future date
  IF NEW.subscription_type = 'lifetime' THEN
    NEW.subscription_ends_at := '2099-12-31 23:59:59+00'::TIMESTAMP WITH TIME ZONE;
    NEW.subscription_status := 'active';
  END IF;

  -- For other subscription types, check if they're expired
  IF NEW.subscription_ends_at IS NOT NULL AND NEW.subscription_ends_at < NOW() THEN
    NEW.subscription_status := 'inactive';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update subscription status
CREATE TRIGGER update_subscription_status_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_status();

-- Update user_limits table to handle unlimited QR codes for lifetime subscribers
ALTER TABLE user_limits
ADD COLUMN is_unlimited BOOLEAN DEFAULT false;

-- Create a function to set unlimited QR codes for lifetime subscribers
CREATE OR REPLACE FUNCTION set_unlimited_qr_codes()
RETURNS trigger AS $$
BEGIN
  IF NEW.subscription_type = 'lifetime' AND NEW.subscription_status = 'active' THEN
    UPDATE user_limits
    SET 
      monthly_qr_limit = 999999999,
      is_unlimited = true,
      updated_at = NOW()
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set unlimited QR codes for lifetime subscribers
CREATE TRIGGER set_unlimited_qr_codes_trigger
  AFTER INSERT OR UPDATE OF subscription_type, subscription_status ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_unlimited_qr_codes(); 