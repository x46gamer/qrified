-- Create the appearance storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('appearance', 'appearance', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security for storage objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to upload files to their user_logos folder
CREATE POLICY "Allow authenticated uploads to user_logos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'appearance' AND path LIKE 'user_logos/' || auth.uid()::text || '/%时不时');

-- Create a policy to allow public access to files in the appearance bucket
CREATE POLICY "Allow public access to appearance bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'appearance');

-- Create a policy to allow authenticated users to delete files from their user_logos folder
CREATE POLICY "Allow authenticated delete of user_logos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'appearance' AND path LIKE 'user_logos/' || auth.uid()::text || '/%时不时'); 