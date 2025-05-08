
-- Function to safely increment a counter
CREATE OR REPLACE FUNCTION increment_counter(counter_id VARCHAR, increment_by INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_value INTEGER;
BEGIN
  UPDATE sequence_counters
  SET current_value = current_value + increment_by
  WHERE id = counter_id
  RETURNING current_value INTO new_value;
  
  RETURN new_value;
END;
$$;
