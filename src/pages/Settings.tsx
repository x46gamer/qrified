import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { ExternalLink, Save } from "lucide-react";
import DomainSettings from '@/components/DomainSettings';
import TeamManagement from '@/components/TeamManagement';
import { useAuth } from "@/contexts/AuthContext";
import { useAppearanceSettings } from "@/contexts/AppearanceContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('section') || 'general';
  const { primaryColor, secondaryColor, setTheme } = useAppearanceSettings();
  
  const [companyName, setCompanyName] = useState('My Company');
  const [defaultTemplate, setDefaultTemplate] = useState('classic');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleTabChange = (value: string) => {
    setSearchParams({ section: value });
  };
  
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Get the app settings ID or create it if it doesn't exist
      const { data: settingsData } = await supabase
        .from('app_settings')
        .select('id')
        .limit(1);
      
      const settingsId = settingsData && settingsData.length > 0 
        ? settingsData[0].id 
        : 'default-settings';
      
      // Save the settings
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: settingsId,
          settings: {
            companyName,
            defaultTemplate,
            primaryColor,
            secondaryColor
          }
        }, {
          onConflict: 'id'
        });
      
      if (error) {
        throw error;
      }
      
      // Update the theme
      setTheme({
        primaryColor,
        secondaryColor
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
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Settings</h1>
        <p className="text-lg text-muted-foreground">{isAdmin ? 'Manage your team and system settings' : 'Manage your personal settings'}</p>
      </header>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          {isAdmin && <TabsTrigger value="domains">Domains</TabsTrigger>}
          {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-template">Default QR Template</Label>
                  <select 
                    id="default-template"
                    value={defaultTemplate}
                    onChange={(e) => setDefaultTemplate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="classic">Classic</option>
                    <option value="modern-blue">Modern Blue</option>
                    <option value="modern-beige">Modern Beige</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input 
                    id="primary-color" 
                    type="color" 
                    value={primaryColor || '#000000'} 
                    onChange={(e) => setTheme({ primaryColor: e.target.value, secondaryColor })}
                    className="h-10 p-1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <Input 
                    id="secondary-color" 
                    type="color" 
                    value={secondaryColor || '#FFFFFF'} 
                    onChange={(e) => setTheme({ primaryColor, secondaryColor: e.target.value })}
                    className="h-10 p-1"
                  />
                </div>
              </div>
              
              <Button 
                onClick={saveSettings} 
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="domains">
            <DomainSettings />
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="team">
            <TeamManagement />
          </TabsContent>
        )}

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Resources</CardTitle>
              <CardDescription>Get help and find information about our service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/about" className="block border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    About Us <ExternalLink className="ml-1 h-4 w-4" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Learn more about our company and mission</p>
                </Link>
                
                <Link to="/faq" className="block border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    Frequently Asked Questions <ExternalLink className="ml-1 h-4 w-4" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Find answers to common questions</p>
                </Link>
                
                <Link to="/contact" className="block border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    Contact Support <ExternalLink className="ml-1 h-4 w-4" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Get in touch with our support team</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
