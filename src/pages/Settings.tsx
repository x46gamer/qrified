import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { user, profile } = useAuth();
  const theme = useAppearanceSettings();
  const [selectedTab, setSelectedTab] = useState("appearance");
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Ensure we have a theme.setTheme function
  const updateSettings = theme.setTheme;
  
  // Form state for appearance settings
  const [formState, setFormState] = useState({
    successTitle: theme.successTitle,
    successDescription: theme.successDescription,
    successFooterText: theme.successFooterText,
    failureTitle: theme.failureTitle,
    failureDescription: theme.failureDescription,
    failureFooterText: theme.failureFooterText,
    isRtl: theme.isRtl,
    enableReviews: theme.enableReviews,
    enableFeedback: theme.enableFeedback,
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    logoUrl: theme.logoUrl || '',
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update form state when theme changes
  useEffect(() => {
    setFormState({
      successTitle: theme.successTitle,
      successDescription: theme.successDescription,
      successFooterText: theme.successFooterText,
      failureTitle: theme.failureTitle,
      failureDescription: theme.failureDescription,
      failureFooterText: theme.failureFooterText,
      isRtl: theme.isRtl,
      enableReviews: theme.enableReviews,
      enableFeedback: theme.enableFeedback,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      logoUrl: theme.logoUrl || '',
    });
  }, [theme]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleColorChange = (color: string, field: 'primaryColor' | 'secondaryColor') => {
    setFormState(prev => ({ ...prev, [field]: color }));
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file is too large. Maximum size is 2MB.');
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, or SVG image.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload to Supabase Storage
      const fileName = `logos/${user?.id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('app-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('app-assets')
        .getPublicUrl(fileName);
      
      setFormState(prev => ({ ...prev, logoUrl: urlData.publicUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Update theme settings
      await updateSettings({
        ...theme,
        successTitle: formState.successTitle,
        successDescription: formState.successDescription,
        successFooterText: formState.successFooterText,
        failureTitle: formState.failureTitle,
        failureDescription: formState.failureDescription,
        failureFooterText: formState.failureFooterText,
        isRtl: formState.isRtl,
        enableReviews: formState.enableReviews,
        enableFeedback: formState.enableFeedback,
        primaryColor: formState.primaryColor,
        secondaryColor: formState.secondaryColor,
        logoUrl: formState.logoUrl || null,
      });
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Settings</h1>
        <p className="text-lg text-muted-foreground">Customize your application settings</p>
      </header>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how your verification pages look
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Brand Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border" 
                        style={{ backgroundColor: formState.primaryColor }}
                      />
                      <Input 
                        value={formState.primaryColor} 
                        name="primaryColor"
                        onChange={handleInputChange}
                        className="font-mono"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">Pick</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker 
                            color={formState.primaryColor} 
                            onChange={(color) => handleColorChange(color, 'primaryColor')} 
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border" 
                        style={{ backgroundColor: formState.secondaryColor }}
                      />
                      <Input 
                        value={formState.secondaryColor} 
                        name="secondaryColor"
                        onChange={handleInputChange}
                        className="font-mono"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">Pick</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker 
                            color={formState.secondaryColor} 
                            onChange={(color) => handleColorChange(color, 'secondaryColor')} 
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Logo</h3>
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Upload Logo</Label>
                  <div className="flex items-center gap-4">
                    {formState.logoUrl && (
                      <div className="w-16 h-16 border rounded-md overflow-hidden">
                        <img 
                          src={formState.logoUrl} 
                          alt="Company Logo" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/svg+xml"
                        onChange={handleLogoUpload}
                        disabled={isUploading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 512x512px. Max size: 2MB. Formats: JPEG, PNG, SVG.
                      </p>
                    </div>
                    {isUploading && <Loader2 className="animate-spin h-5 w-5" />}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Success Message</h3>
                <div className="space-y-2">
                  <Label htmlFor="success-title">Title</Label>
                  <Input
                    id="success-title"
                    name="successTitle"
                    value={formState.successTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success-description">Description</Label>
                  <Textarea
                    id="success-description"
                    name="successDescription"
                    value={formState.successDescription}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success-footer">Footer Text</Label>
                  <Input
                    id="success-footer"
                    name="successFooterText"
                    value={formState.successFooterText}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Failure Message</h3>
                <div className="space-y-2">
                  <Label htmlFor="failure-title">Title</Label>
                  <Input
                    id="failure-title"
                    name="failureTitle"
                    value={formState.failureTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failure-description">Description</Label>
                  <Textarea
                    id="failure-description"
                    name="failureDescription"
                    value={formState.failureDescription}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failure-footer">Footer Text</Label>
                  <Input
                    id="failure-footer"
                    name="failureFooterText"
                    value={formState.failureFooterText}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rtl-switch" className="block">Right-to-Left Layout</Label>
                    <p className="text-sm text-muted-foreground">Enable for Arabic and other RTL languages</p>
                  </div>
                  <Switch
                    id="rtl-switch"
                    checked={formState.isRtl}
                    onCheckedChange={(checked) => handleSwitchChange('isRtl', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reviews-switch" className="block">Enable Reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow users to leave reviews after verification</p>
                  </div>
                  <Switch
                    id="reviews-switch"
                    checked={formState.enableReviews}
                    onCheckedChange={(checked) => handleSwitchChange('enableReviews', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="feedback-switch" className="block">Enable Feedback</Label>
                    <p className="text-sm text-muted-foreground">Allow users to submit feedback</p>
                  </div>
                  <Switch
                    id="feedback-switch"
                    checked={formState.enableFeedback}
                    onCheckedChange={(checked) => handleSwitchChange('enableFeedback', checked)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Verification Settings</CardTitle>
              <CardDescription>
                Configure how product verification works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Verification Options</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Single-Use QR Codes</Label>
                    <p className="text-sm text-muted-foreground">QR codes can only be verified once</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Collect User Location</Label>
                    <p className="text-sm text-muted-foreground">Record location data during verification</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Require User Consent</Label>
                    <p className="text-sm text-muted-foreground">Ask for consent before collecting data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails for suspicious verifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send verification events to a webhook URL</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                Save Verification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    defaultValue={profile?.display_name || ''}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please contact support.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                
                <div className="border border-destructive/20 rounded-md p-4 bg-destructive/5">
                  <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your API Keys</h3>
                
                <div className="border rounded-md p-4 bg-secondary/20">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">Production Key</h4>
                      <p className="text-sm text-muted-foreground">Use for live applications</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value="sk_live_••••••••••••••••••••••••••••••"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-secondary/20">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">Test Key</h4>
                      <p className="text-sm text-muted-foreground">Use for development and testing</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value="sk_test_••••••••••••••••••••••••••••••"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New API Key</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Mobile App Integration"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="read-permission" />
                      <Label htmlFor="read-permission">Read QR codes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="write-permission" />
                      <Label htmlFor="write-permission">Create QR codes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verify-permission" />
                      <Label htmlFor="verify-permission">Verify QR codes</Label>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                  Create API Key
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to integrate with our API to create and verify QR codes programmatically.
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
