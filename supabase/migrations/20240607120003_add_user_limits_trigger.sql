-- Function to insert user_limits row with 100 qr codes for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_limits()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_limits (id, qr_limit, qr_created, qr_successful, monthly_qr_limit, monthly_qr_created)
  VALUES (NEW.id, 100, 0, 0, 100, 0)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created_limits ON auth.users;
CREATE TRIGGER on_auth_user_created_limits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_limits();

-- Update all existing users with 0 qr_limit to 100
UPDATE public.user_limits SET qr_limit = 100, monthly_qr_limit = 100 WHERE qr_limit = 0; 