
-- Function to safely increment a counter
CREATE OR REPLACE FUNCTION increment_counter(counter_id VARCHAR, increment_by INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_value INTEGER;
BEGIN
  -- Use FOR UPDATE to lock the row during update to prevent race conditions
  UPDATE sequence_counters
  SET current_value = current_value + increment_by
  WHERE id = counter_id
  RETURNING current_value INTO new_value;
  
  IF new_value IS NULL THEN
    RAISE EXCEPTION 'Counter with ID % not found', counter_id;
  END IF;
  
  RETURN new_value;
END;
$$;
