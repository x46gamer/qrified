-- Add email column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN email TEXT;

-- Update existing records with email from auth.users
UPDATE user_profiles
SET email = auth.users.email
FROM auth.users
WHERE user_profiles.id = auth.users.id;

-- Make email column NOT NULL after updating existing records
ALTER TABLE user_profiles
ALTER COLUMN email SET NOT NULL;

-- Add index for faster lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email); 