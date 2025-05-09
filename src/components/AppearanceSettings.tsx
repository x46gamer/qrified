import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAppearance } from '@/contexts/AppearanceContext';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabaseClient';
import { AppearanceSettings } from '@/types';

const AppearanceSettings: React.FC = () => {
  const { appearance, setAppearance } = useAppearance();
  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(appearance);
  const [initialSettings, setInitialSettings] = useState<AppearanceSettings>(appearance);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getStoredSettings();
  }, []);

  const getStoredSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'appearance')
      .single();

    if (error) {
      console.error('Error fetching appearance settings:', error);
      return;
    }

    if (data?.value) {
      // Add type assertion to handle the conversion safely
      const settings = data.value as AppearanceSettings;
      setLocalSettings(settings);
      setInitialSettings(settings);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setLocalSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked
    }));
  };

  const resetSettings = () => {
    setLocalSettings(initialSettings);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'appearance',
          value: localSettings as any
        });

      if (error) {
        console.error('Error saving appearance settings:', error);
        toast({
          title: "Error",
          description: "Failed to save appearance settings",
          variant: "destructive"
        });
      } else {
        setAppearance(localSettings);
        setInitialSettings(localSettings);
        toast({
          title: "Success",
          description: "Appearance settings saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      toast({
        title: "Error",
        description: "Failed to save appearance settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = JSON.stringify(localSettings) !== JSON.stringify(initialSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input 
              type="color" 
              id="primaryColor" 
              name="primaryColor"
              value={localSettings.primaryColor}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <Input 
              type="color" 
              id="secondaryColor"
              name="secondaryColor"
              value={localSettings.secondaryColor}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch 
            id="darkMode" 
            checked={localSettings.darkMode}
            onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={resetSettings}
            disabled={!isDirty || isSaving}
          >
            Reset
          </Button>
          <Button 
            type="button" 
            onClick={saveSettings}
            disabled={!isDirty || isSaving}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
