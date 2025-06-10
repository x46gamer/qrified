-- Add a role column to the user_profiles table
ALTER TABLE user_profiles
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update existing user profiles to have a default 'user' role
UPDATE user_profiles
SET role = 'user'
WHERE role IS NULL;

-- Create a policy to allow admins to view and update roles
CREATE POLICY "Admins can view and update user roles"
    ON user_profiles FOR ALL
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (true);

-- Optional: If you want to enable a default admin user, you can run this manually:
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'your_admin_email@example.com';
