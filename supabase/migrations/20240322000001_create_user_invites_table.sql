-- Create user_invites table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'employee',
    invited_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    accepted_user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE user_invites ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own invitations
CREATE POLICY "Users can view their own invitations"
    ON user_invites FOR SELECT
    USING (auth.uid() = invited_by);

-- Allow users to create invitations
CREATE POLICY "Users can create invitations"
    ON user_invites FOR INSERT
    WITH CHECK (auth.uid() = invited_by);

-- Allow users to update their own invitations
CREATE POLICY "Users can update their own invitations"
    ON user_invites FOR UPDATE
    USING (auth.uid() = invited_by);

-- Allow users to delete their own invitations
CREATE POLICY "Users can delete their own invitations"
    ON user_invites FOR DELETE
    USING (auth.uid() = invited_by);

-- Create indexes
CREATE INDEX idx_user_invites_token ON user_invites(token);
CREATE INDEX idx_user_invites_email ON user_invites(email);
CREATE INDEX idx_user_invites_invited_by ON user_invites(invited_by); 