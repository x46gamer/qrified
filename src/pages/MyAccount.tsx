import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const timezones = [
  { value: 'UTC', label: '(GMT +00:00) UTC' },
  // Add more timezones as needed
];
const languages = [
  { value: 'en', label: 'English' },
  // Add more languages as needed
];

const MyAccount = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    timezone: 'UTC',
    language: 'en',
  });
  const [authData, setAuthData] = useState({
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user?.id)
      .single();
    if (!error && data) {
      setProfile(data);
      setProfileData({
        full_name: data.full_name || '',
        timezone: data.timezone || 'UTC',
        language: data.language || 'en',
      });
      setAuthData((prev) => ({ ...prev, email: data.email || '' }));
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('id', user?.id);
    setIsUpdating(false);
    if (!error) {
      toast.success('Profile updated');
      fetchProfile();
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
    if (uploadError) {
      setIsUploading(false);
      toast.error('Failed to upload avatar');
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user?.id);
    setIsUploading(false);
    if (!updateError) {
      toast.success('Avatar updated');
      fetchProfile();
    } else {
      toast.error('Failed to update avatar');
    }
  };

  const handleAvatarRemove = async () => {
    setIsUploading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ avatar_url: null })
      .eq('id', user?.id);
    setIsUploading(false);
    if (!error) {
      toast.success('Avatar removed');
      fetchProfile();
    } else {
      toast.error('Failed to remove avatar');
    }
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async () => {
    if (authData.new_password !== authData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    // Only update password if new_password is filled
    if (!authData.new_password) return;
    const { error } = await supabase.auth.updateUser({ password: authData.new_password });
    if (!error) {
      toast.success('Password updated');
      setAuthData({ ...authData, current_password: '', new_password: '', confirm_password: '' });
    } else {
      toast.error('Failed to update password');
    }
  };

  const handleDeactivate = async () => {
    setDeactivateLoading(true);
    // Implement your deactivation logic here
    setTimeout(() => {
      setDeactivateLoading(false);
      toast.success('Account deactivated (demo)');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-8">Profile</h2>
      <div className="flex items-center mb-6">
        <div>
          <Label className="block mb-1">Profile photo</Label>
          <div className="text-xs text-muted-foreground mb-2">Recommended size: 300 x 300</div>
          <div className="flex gap-2 mb-2">
            <Button asChild size="sm" variant="outline" disabled={isUploading}>
              <Label htmlFor="avatar-upload" className="cursor-pointer">Change</Label>
            </Button>
            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
            <Button size="sm" variant="outline" onClick={handleAvatarRemove} disabled={isUploading}>Remove</Button>
          </div>
        </div>
        <div className="ml-auto">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={profileData.full_name}
          onChange={handleProfileChange}
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          name="timezone"
          className="w-full border rounded px-3 py-2"
          value={profileData.timezone}
          onChange={handleProfileChange}
          required
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-8">
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          name="language"
          className="w-full border rounded px-3 py-2"
          value={profileData.language}
          onChange={handleProfileChange}
          required
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>
      <Button onClick={handleProfileUpdate} disabled={isUpdating} className="mb-12">{isUpdating ? 'Saving...' : 'Save changes'}</Button>

      <h2 className="text-2xl font-semibold mb-6">Authentication</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={authData.email} disabled type="email" />
        </div>
        <div>
          <Label htmlFor="current_password">Current password</Label>
          <Input id="current_password" name="current_password" value={authData.current_password} onChange={handleAuthChange} type="password" />
        </div>
        <div>
          <Label htmlFor="new_password">New password</Label>
          <Input id="new_password" name="new_password" value={authData.new_password} onChange={handleAuthChange} type="password" />
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm password</Label>
          <Input id="confirm_password" name="confirm_password" value={authData.confirm_password} onChange={handleAuthChange} type="password" />
        </div>
      </div>
      <Button onClick={handlePasswordChange} className="mb-12">Change password</Button>

      <h2 className="text-xl font-semibold mb-2">Deactivate account</h2>
      <div className="text-sm text-muted-foreground mb-4">
        Careful! This will permanently deactivate your account in the current community. You will no longer have access to this community after you do this. Your account will remain active, ensuring access to other subscribed communities.
      </div>
      <Button variant="destructive" onClick={handleDeactivate} disabled={deactivateLoading}>
        {deactivateLoading ? 'Deactivating...' : 'Deactivate my account'}
      </Button>
    </div>
  );
};

export default MyAccount; 