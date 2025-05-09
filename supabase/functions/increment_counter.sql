
-- Function to safely increment a counter
CREATE OR REPLACE FUNCTION increment_counter(counter_id VARCHAR, increment_by INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_value INTEGER;
BEGIN
  -- Update the counter value or insert if it doesn't exist
  INSERT INTO sequence_counters (id, current_value)
  VALUES (counter_id, increment_by)
  ON CONFLICT (id) DO UPDATE
  SET current_value = sequence_counters.current_value + increment_by
  RETURNING current_value INTO new_value;
  
  RETURN new_value;
END;
$$;
