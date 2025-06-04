import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
import LanguagePresets from '@/components/LanguagePresets';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const AppearanceSettings = () => {
  const { 
    updateSettings,
    isSaving,
    successBackground,
    successText,
    successIcon,
    failureBackground,
    failureText,
    failureIcon,
    successTitle,
    successDescription,
    successFooterText,
    failureTitle,
    failureDescription,
    failureFooterText,
    isRtl,
    enableReviews,
    enableFeedback,
    logoUrl,
    primaryColor,
    secondaryColor,
    reviewButtonText,
    feedbackButtonText
  } = useAppearanceSettings();
  
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const [settings, setSettings] = useState({
    primaryColor,
    secondaryColor,
    successBackground,
    successText,
    successIcon,
    successTitle,
    successDescription,
    successFooterText,
    failureBackground,
    failureText,
    failureIcon,
    failureTitle,
    failureDescription,
    failureFooterText,
    logoUrl,
    isRtl,
    enableReviews,
    enableFeedback,
    reviewButtonText: reviewButtonText || 'Leave a Review',
    feedbackButtonText: feedbackButtonText || 'Give Feedback',
  });

  useEffect(() => {
    setSettings({
      primaryColor,
      secondaryColor,
      successBackground,
      successText,
      successIcon,
      successTitle,
      successDescription,
      successFooterText,
      failureBackground,
      failureText,
      failureIcon,
      failureTitle,
      failureDescription,
      failureFooterText,
      logoUrl,
      isRtl,
      enableReviews,
      enableFeedback,
      reviewButtonText: reviewButtonText || 'Leave a Review',
      feedbackButtonText: feedbackButtonText || 'Give Feedback',
    });
  }, [
    primaryColor,
    secondaryColor,
    successBackground,
    successText,
    successIcon,
    successTitle,
    successDescription,
    successFooterText,
    failureBackground,
    failureText,
    failureIcon,
    failureTitle,
    failureDescription,
    failureFooterText,
    logoUrl,
    isRtl,
    enableReviews,
    enableFeedback,
    reviewButtonText,
    feedbackButtonText,
  ]);

  const handleLanguagePreset = (preset: 'english' | 'arabic') => {
    if (preset === 'english') {
      setSettings(prev => ({
        ...prev,
        successTitle: 'Product Verified',
        successDescription: 'This product is legitimate and original. Thank you for checking its authenticity.',
        successFooterText: 'This QR code has been marked as used and cannot be verified again.',
        failureTitle: 'Product NOT Verified',
        failureDescription: 'This product could not be verified as authentic. It may be counterfeit or has been previously verified.',
        failureFooterText: 'If you believe this is an error, please contact the product manufacturer.',
        isRtl: false,
        reviewButtonText: 'Leave a Review',
        feedbackButtonText: 'Give Feedback',
      }));
    } else if (preset === 'arabic') {
      setSettings(prev => ({
        ...prev,
        successTitle: 'تم التحقق من المنتج',
        successDescription: 'هذا المنتج أصلي وموثوق. شكراً لك على التحقق من صحته',
        successFooterText: 'هذا ولا يمكن التحقق منه مرة أخرى QR لقد تم استخدام رمز',
        failureTitle: 'تعذر التحقق من المنتج',
        failureDescription: 'تعذر التحقق من أصلية هذا المنتج. قد يكون مزوراً أو تم التحقق منه مسبقاً',
        failureFooterText: 'إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بالشركة المصنعة للمنتج',
        isRtl: true,
        reviewButtonText: 'اترك تعليقًا',
        feedbackButtonText: 'قدم ملاحظات',
      }));
    }
    toast.success(`${preset === 'english' ? 'English' : 'Arabic'} preset loaded successfully`);
  };



  const saveSettings = async () => {
    setIsLoading(true);
    try {
      console.log('Saving settings:', settings);

      await updateSettings(settings);
      
      console.log('Settings saved successfully');
      toast.success('Settings saved successfully');
      
      localStorage.setItem('appearance_updated', Date.now().toString());
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appearance Settings</h2>
        <Button onClick={saveSettings} disabled={isLoading || isSaving || isUploadingLogo}>
          {isLoading || isSaving || isUploadingLogo ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Language Presets */}
      <LanguagePresets onLoadPreset={handleLanguagePreset} />

      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={settings.logoUrl || ''}
              onChange={(e) => updateSetting('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          


          <div className="flex items-center space-x-2">
            <Switch
              id="isRtl"
              checked={settings.isRtl}
              onCheckedChange={(checked) => updateSetting('isRtl', checked)}
            />
            <Label htmlFor="isRtl">Right-to-Left Text Direction</Label>
          </div>
        </CardContent>
      </Card>

      {/* Success Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Success Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="successTitle">Success Title</Label>
            <Input
              id="successTitle"
              value={settings.successTitle}
              onChange={(e) => updateSetting('successTitle', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="successDescription">Success Description</Label>
            <Textarea
              id="successDescription"
              value={settings.successDescription}
              onChange={(e) => updateSetting('successDescription', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="successFooterText">Success Footer Text</Label>
            <Textarea
              id="successFooterText"
              value={settings.successFooterText}
              onChange={(e) => updateSetting('successFooterText', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="successBackground">Success Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="successBackground"
                type="color"
                value={settings.successBackground}
                onChange={(e) => updateSetting('successBackground', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.successBackground}
                onChange={(e) => updateSetting('successBackground', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="successText">Success Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="successText"
                type="color"
                value={settings.successText}
                onChange={(e) => updateSetting('successText', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.successText}
                onChange={(e) => updateSetting('successText', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="successIcon">Success Icon Color</Label>
            <div className="flex gap-2">
              <Input
                id="successIcon"
                type="color"
                value={settings.successIcon}
                onChange={(e) => updateSetting('successIcon', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.successIcon}
                onChange={(e) => updateSetting('successIcon', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failure Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Failure Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="failureTitle">Failure Title</Label>
            <Input
              id="failureTitle"
              value={settings.failureTitle}
              onChange={(e) => updateSetting('failureTitle', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="failureDescription">Failure Description</Label>
            <Textarea
              id="failureDescription"
              value={settings.failureDescription}
              onChange={(e) => updateSetting('failureDescription', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="failureFooterText">Failure Footer Text</Label>
            <Textarea
              id="failureFooterText"
              value={settings.failureFooterText}
              onChange={(e) => updateSetting('failureFooterText', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="failureBackground">Failure Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="failureBackground"
                type="color"
                value={settings.failureBackground}
                onChange={(e) => updateSetting('failureBackground', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.failureBackground}
                onChange={(e) => updateSetting('failureBackground', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="failureText">Failure Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="failureText"
                type="color"
                value={settings.failureText}
                onChange={(e) => updateSetting('failureText', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.failureText}
                onChange={(e) => updateSetting('failureText', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="failureIcon">Failure Icon Color</Label>
            <div className="flex gap-2">
              <Input
                id="failureIcon"
                type="color"
                value={settings.failureIcon}
                onChange={(e) => updateSetting('failureIcon', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.failureIcon}
                onChange={(e) => updateSetting('failureIcon', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableReviews"
              checked={settings.enableReviews}
              onCheckedChange={(checked) => updateSetting('enableReviews', checked)}
            />
            <Label htmlFor="enableReviews">Enable Product Reviews</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableFeedback"
              checked={settings.enableFeedback}
              onCheckedChange={(checked) => updateSetting('enableFeedback', checked)}
            />
            <Label htmlFor="enableFeedback">Enable Customer Feedback</Label>
          </div>

          <div>
            <Label htmlFor="reviewButtonText">Review Button Text</Label>
            <Input
              id="reviewButtonText"
              value={settings.reviewButtonText}
              onChange={(e) => updateSetting('reviewButtonText', e.target.value)}
              placeholder="Leave a Review"
            />
          </div>

          <div>
            <Label htmlFor="feedbackButtonText">Feedback Button Text</Label>
            <Input
              id="feedbackButtonText"
              value={settings.feedbackButtonText}
              onChange={(e) => updateSetting('feedbackButtonText', e.target.value)}
              placeholder="Give Feedback"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Success Preview */}
            <div 
              className="p-4 rounded-lg border-2"
              style={{ 
                backgroundColor: settings.successBackground,
                color: settings.successText 
              }}
              dir={settings.isRtl ? 'rtl' : 'ltr'}
            >
              <div className="text-center">
                <div 
                  className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                  style={{ color: settings.successIcon }}
                >
                  ✓
                </div>
                <h3 className="font-bold mb-2">{settings.successTitle}</h3>
                <p className="text-sm mb-2">{settings.successDescription}</p>
                <p className="text-xs">{settings.successFooterText}</p>
              </div>
            </div>

            {/* Failure Preview */}
            <div 
              className="p-4 rounded-lg border-2"
              style={{ 
                backgroundColor: settings.failureBackground,
                color: settings.failureText 
              }}
              dir={settings.isRtl ? 'rtl' : 'ltr'}
            >
              <div className="text-center">
                <div 
                  className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                  style={{ color: settings.failureIcon }}
                >
                  ✗
                </div>
                <h3 className="font-bold mb-2">{settings.failureTitle}</h3>
                <p className="text-sm mb-2">{settings.failureDescription}</p>
                <p className="text-xs">{settings.failureFooterText}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
