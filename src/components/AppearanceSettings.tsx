
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export type ThemeSettings = {
  // Color settings
  successBackground: string;
  successText: string;
  successIcon: string;
  failureBackground: string;
  failureText: string;
  failureIcon: string;
  
  // Text content
  successTitle: string;
  successDescription: string;
  successFooterText: string;
  failureTitle: string;
  failureDescription: string;
  failureFooterText: string;
  
  // Direction settings
  isRtl: boolean;
  
  // Feature toggles
  enableReviews: boolean;
  enableFeedback: boolean;
  
  // Logo
  logoUrl: string | null;
};

const defaultTheme: ThemeSettings = {
  // Default colors
  successBackground: "#f0fdf4", // green-50
  successText: "#16a34a", // green-600
  successIcon: "#22c55e", // green-500
  failureBackground: "#fef2f2", // red-50
  failureText: "#dc2626", // red-600
  failureIcon: "#ef4444", // red-500
  
  // Default text content
  successTitle: "Product Verified",
  successDescription: "This product is legitimate and original. Thank you for checking its authenticity.",
  successFooterText: "This QR code has been marked as used and cannot be verified again.",
  failureTitle: "Not Authentic",
  failureDescription: "This product could not be verified as authentic. It may be counterfeit or has been previously verified.",
  failureFooterText: "If you believe this is an error, please contact the product manufacturer.",
  
  // Default direction
  isRtl: false,
  
  // Default feature toggles
  enableReviews: false,
  enableFeedback: false,
  
  // Default logo
  logoUrl: null,
};

export const AppearanceSettings = () => {
  const [activeTab, setActiveTab] = useState<"success" | "failure" | "features" | "general">("general");
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
          // Merge with default theme to ensure we have all required properties
          setTheme({...defaultTheme, ...data.settings as ThemeSettings});
          
          // Set logo preview if exists
          if ((data.settings as ThemeSettings).logoUrl) {
            setLogoPreview((data.settings as ThemeSettings).logoUrl);
          }
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("Logo image must be smaller than 2MB");
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
        setUploadError("Only JPEG, PNG and SVG formats are supported");
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;
    
    try {
      // Generate a unique file path
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('app-assets')
        .upload(filePath, logoFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase
        .storage
        .from('app-assets')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Upload logo if a new one was selected
      let logoUrl = theme.logoUrl;
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }
      
      // Update the theme settings with the logo URL
      const updatedTheme = { ...theme, logoUrl };
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          id: 'theme', 
          settings: updatedTheme 
        }, { 
          onConflict: 'id' 
        });
      
      if (error) throw error;
      
      // Update local state with the new logo URL
      setTheme(updatedTheme);
      setLogoFile(null);  // Reset the file input
      
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
    setLogoPreview(null);
    setLogoFile(null);
    toast.info('Settings reset to default values');
  };

  const handleColorChange = (color: string, property: keyof ThemeSettings) => {
    setTheme(prev => ({ ...prev, [property]: color }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: keyof ThemeSettings) => {
    setTheme(prev => ({ ...prev, [property]: e.target.value }));
  };

  const handleToggleChange = (checked: boolean, property: keyof ThemeSettings) => {
    setTheme(prev => ({ ...prev, [property]: checked }));
  };

  const renderColorPicker = (colorKey: keyof ThemeSettings, label: string) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={colorKey}>{label}</Label>
        <div className="flex items-center space-x-2">
          <div 
            className="h-5 w-5 rounded border" 
            style={{ backgroundColor: theme[colorKey] as string }}
          />
          <span className="text-sm text-muted-foreground">{theme[colorKey] as string}</span>
        </div>
      </div>
      <HexColorPicker
        color={theme[colorKey] as string}
        onChange={(color) => handleColorChange(color, colorKey)}
        className="w-full max-w-[240px]"
      />
    </div>
  );

  const renderTextField = (key: keyof ThemeSettings, label: string, placeholder: string, multiline: boolean = false) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      {multiline ? (
        <Textarea
          id={key}
          value={theme[key] as string}
          onChange={(e) => handleTextChange(e, key)}
          placeholder={placeholder}
          className="min-h-[80px]"
        />
      ) : (
        <Input
          id={key}
          value={theme[key] as string}
          onChange={(e) => handleTextChange(e, key)}
          placeholder={placeholder}
        />
      )}
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
          Customize how the product verification pages look and function
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="success">Success Page</TabsTrigger>
            <TabsTrigger value="failure">Failure Page</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="space-y-6 pt-6">
          <TabsContent value="general" className="space-y-6">
            {/* RTL Support */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rtl-mode">RTL Text Direction</Label>
                <p className="text-sm text-muted-foreground">
                  Enable right-to-left text direction for languages like Arabic and Hebrew
                </p>
              </div>
              <Switch 
                id="rtl-mode"
                checked={theme.isRtl}
                onCheckedChange={(checked) => handleToggleChange(checked, 'isRtl')}
              />
            </div>
            
            <Separator className="my-4" />
            
            {/* Logo Upload */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Brand Logo</Label>
                <p className="text-sm text-muted-foreground">
                  Upload your brand logo to display on verification pages (Max 2MB, formats: JPEG, PNG, SVG)
                </p>
              </div>
              
              <div className="flex flex-col gap-4 items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                {logoPreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-h-32 max-w-full object-contain"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoFile(null);
                        if (theme.logoUrl) {
                          setTheme(prev => ({ ...prev, logoUrl: null }));
                        }
                      }}
                    >
                      Remove Logo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gray-100">
                      <Upload size={24} className="text-gray-500" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => document.getElementById('logo-input')?.click()}
                    >
                      Select Logo
                    </Button>
                  </div>
                )}
                <input
                  id="logo-input"
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
              
              {uploadError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="success" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Colors</h3>
                {renderColorPicker("successBackground", "Background Color")}
                {renderColorPicker("successText", "Text Color")}
                {renderColorPicker("successIcon", "Icon Color")}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Text Content</h3>
                {renderTextField("successTitle", "Title", "Product Verified")}
                {renderTextField("successDescription", "Description", "This product is legitimate and original...", true)}
                {renderTextField("successFooterText", "Footer Text", "This QR code has been marked as used...")}
              </div>
            </div>
            
            <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: theme.successBackground }}>
              <div className="flex justify-center">
                {logoPreview && (
                  <img 
                    src={logoPreview} 
                    alt="Brand logo" 
                    className="max-h-12 mb-4 object-contain" 
                  />
                )}
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: theme.successIcon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-3 text-xl font-bold text-center" style={{ color: theme.successText }}>
                {theme.successTitle}
              </h3>
              <p className="mt-2 text-center" style={{ color: theme.successText }}>
                {theme.successDescription}
              </p>
              <p className="mt-4 text-sm text-center" style={{ color: theme.successText }}>
                {theme.successFooterText}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="failure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Colors</h3>
                {renderColorPicker("failureBackground", "Background Color")}
                {renderColorPicker("failureText", "Text Color")}
                {renderColorPicker("failureIcon", "Icon Color")}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Text Content</h3>
                {renderTextField("failureTitle", "Title", "Not Authentic")}
                {renderTextField("failureDescription", "Description", "This product could not be verified as authentic...", true)}
                {renderTextField("failureFooterText", "Footer Text", "If you believe this is an error...")}
              </div>
            </div>
            
            <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: theme.failureBackground }}>
              <div className="flex justify-center">
                {logoPreview && (
                  <img 
                    src={logoPreview} 
                    alt="Brand logo" 
                    className="max-h-12 mb-4 object-contain" 
                  />
                )}
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: theme.failureIcon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-3 text-xl font-bold text-center" style={{ color: theme.failureText }}>
                {theme.failureTitle}
              </h3>
              <p className="mt-2 text-center" style={{ color: theme.failureText }}>
                {theme.failureDescription}
              </p>
              <p className="mt-4 text-sm text-center" style={{ color: theme.failureText }}>
                {theme.failureFooterText}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            {/* Reviews Feature Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-reviews">Enable Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to leave reviews after product verification
                  </p>
                </div>
                <Switch 
                  id="enable-reviews"
                  checked={theme.enableReviews}
                  onCheckedChange={(checked) => handleToggleChange(checked, 'enableReviews')}
                />
              </div>

              {theme.enableReviews && (
                <div className="ml-6 pl-2 border-l-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    When enabled, a review form will be displayed on the success page allowing customers to:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Rate their purchase with stars</li>
                    <li>Upload product photos</li>
                    <li>Leave text comments</li>
                  </ul>
                </div>
              )}
            </div>

            <Separator />

            {/* Feedback Feature Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-feedback">Enable Feedback Form</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to submit improvement suggestions
                  </p>
                </div>
                <Switch 
                  id="enable-feedback"
                  checked={theme.enableFeedback}
                  onCheckedChange={(checked) => handleToggleChange(checked, 'enableFeedback')}
                />
              </div>

              {theme.enableFeedback && (
                <div className="ml-6 pl-2 border-l-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    When enabled, a feedback form will be shown on the success page for customers to suggest improvements.
                  </p>
                </div>
              )}
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
