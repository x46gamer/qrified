-- Temporarily disable trial activations during lifetime deal
CREATE OR REPLACE FUNCTION check_trial_status()
RETURNS trigger AS $$
BEGIN
  -- If trial_started_at is set but trial_ended_at is not, set trial_ended_at to 14 days after trial_started_at
  IF NEW.trial_started_at IS NOT NULL AND NEW.trial_ended_at IS NULL THEN
    -- TEMPORARY: During lifetime deal, prevent new trial activations
    IF NEW.trial_status = 'not_started' THEN
      RAISE EXCEPTION 'Free trial is temporarily disabled during our lifetime deal period. Please check out our lifetime deal instead.';
    END IF;
    
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

-- Update existing users with 'not_started' status to show lifetime deal message
UPDATE user_profiles
SET trial_status = 'expired'
WHERE trial_status = 'not_started'; 