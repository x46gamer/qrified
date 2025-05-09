
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

type ThemeColors = {
  successBackground: string;
  successText: string;
  successIcon: string;
  failureBackground: string;
  failureText: string;
  failureIcon: string;
};

const defaultTheme: ThemeColors = {
  successBackground: "#f0fdf4", // green-50
  successText: "#16a34a", // green-600
  successIcon: "#22c55e", // green-500
  failureBackground: "#fef2f2", // red-50
  failureText: "#dc2626", // red-600
  failureIcon: "#ef4444", // red-500
};

export const AppearanceSettings = () => {
  const [activeTab, setActiveTab] = useState<"success" | "failure">("success");
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // Explicitly type the query to app_settings table
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'theme')
          .maybeSingle();

        if (error) throw error;
        
        if (data && data.settings) {
          setTheme(data.settings as ThemeColors);
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        toast.error('Failed to load appearance settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          id: 'theme', 
          settings: theme 
        }, { 
          onConflict: 'id' 
        });
      
      if (error) throw error;
      
      toast.success('Appearance settings saved successfully');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save appearance settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    toast.info('Settings reset to default values');
  };

  const handleColorChange = (color: string, property: keyof ThemeColors) => {
    setTheme(prev => ({ ...prev, [property]: color }));
  };

  const renderColorPicker = (colorKey: keyof ThemeColors, label: string) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={colorKey}>{label}</Label>
        <div className="flex items-center space-x-2">
          <div 
            className="h-5 w-5 rounded border" 
            style={{ backgroundColor: theme[colorKey] }}
          />
          <span className="text-sm text-muted-foreground">{theme[colorKey]}</span>
        </div>
      </div>
      <HexColorPicker
        color={theme[colorKey]}
        onChange={(color) => handleColorChange(color, colorKey)}
        className="w-full max-w-[240px]"
      />
    </div>
  );

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize how the product verification pages look
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "success" | "failure")}>
        <div className="px-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="success">Success Page</TabsTrigger>
            <TabsTrigger value="failure">Failure Page</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="space-y-6 pt-6">
          <TabsContent value="success" className="space-y-4">
            {renderColorPicker("successBackground", "Background Color")}
            {renderColorPicker("successText", "Text Color")}
            {renderColorPicker("successIcon", "Icon Color")}
            
            <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: theme.successBackground }}>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: theme.successIcon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-3 text-xl font-bold text-center" style={{ color: theme.successText }}>Product Verified</h3>
            </div>
          </TabsContent>
          
          <TabsContent value="failure" className="space-y-4">
            {renderColorPicker("failureBackground", "Background Color")}
            {renderColorPicker("failureText", "Text Color")}
            {renderColorPicker("failureIcon", "Icon Color")}
            
            <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: theme.failureBackground }}>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: theme.failureIcon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-3 text-xl font-bold text-center" style={{ color: theme.failureText }}>Not Authentic</h3>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSaving}>
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettings;
