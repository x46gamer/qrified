-- Add trial-related fields to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN trial_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN trial_ended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN trial_status TEXT DEFAULT 'not_started' CHECK (trial_status IN ('not_started', 'active', 'expired'));

-- Create a function to check trial status
CREATE OR REPLACE FUNCTION check_trial_status()
RETURNS trigger AS $$
BEGIN
  -- If trial_started_at is set but trial_ended_at is not, set trial_ended_at to 14 days after trial_started_at
  IF NEW.trial_started_at IS NOT NULL AND NEW.trial_ended_at IS NULL THEN
    NEW.trial_ended_at := NEW.trial_started_at + INTERVAL '14 days';
    NEW.trial_status := 'active';
  END IF;

  -- If trial_ended_at is in the past, set status to expired
  IF NEW.trial_ended_at IS NOT NULL AND NEW.trial_ended_at < NOW() THEN
    NEW.trial_status := 'expired';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update trial status
CREATE TRIGGER update_trial_status
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_trial_status();

-- Update existing users to have 'not_started' trial status
UPDATE user_profiles
SET trial_status = 'not_started'
WHERE trial_status IS NULL; 