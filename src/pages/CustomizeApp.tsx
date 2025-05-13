
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
import { Loader2, QrCode, Save, Settings, Palette } from 'lucide-react';
import QRCodeTemplatePreview from '@/components/QRCodeTemplatePreview';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const CustomizeApp = () => {
  const {
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
    updateSettings,
    isSaving
  } = useAppearanceSettings();
  
  const [localSettings, setLocalSettings] = useState({
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
  });
  
  // Update local state when context settings change
  useEffect(() => {
    setLocalSettings({
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
    });
  }, [
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
  ]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSwitchChange = (checked: boolean, name: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(localSettings);
    
    // Provide a direct link to see the changes
    toast.success(
      <div className="flex flex-col gap-2">
        <span>Appearance settings saved successfully</span>
        <a 
          href="/check?id=preview&test=true" 
          target="_blank"
          className="text-sm underline text-blue-500"
        >
          View verification page preview
        </a>
      </div>,
      { duration: 5000 }
    );
  };
  
  const getPreviewBgStyle = (isSuccess: boolean) => {
    return {
      backgroundColor: isSuccess ? localSettings.successBackground : localSettings.failureBackground,
      color: isSuccess ? localSettings.successText : localSettings.failureText
    };
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-7 w-7 text-primary" />
          <h1 className="text-4xl font-bold">Customize Your App</h1>
        </div>
        <p className="text-lg text-muted-foreground">Personalize the appearance and behavior of your product verification pages</p>
      
        <div className="flex gap-4 mt-4">
          <Link to="/check?id=preview&test=true" target="_blank">
            <Button variant="outline" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Preview QR Verification Page
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              All Settings
            </Button>
          </Link>
        </div>
      </header>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="verification-page" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="verification-page">Verification Page</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verification-page" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Success State</CardTitle>
                  <CardDescription>
                    Customize what users see when a product is verified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successBackground">Success Background Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="successBackground" 
                        name="successBackground" 
                        value={localSettings.successBackground}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.successBackground} 
                        name="successBackground"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successText">Success Text Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="successText" 
                        name="successText" 
                        value={localSettings.successText}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.successText} 
                        name="successText"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successIcon">Success Icon Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="successIcon" 
                        name="successIcon" 
                        value={localSettings.successIcon}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.successIcon}
                        name="successIcon"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successTitle">Success Title</Label>
                    <Input 
                      type="text" 
                      id="successTitle" 
                      name="successTitle" 
                      value={localSettings.successTitle}
                      onChange={handleInputChange}
                      placeholder="Product Verified" 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successDescription">Success Description</Label>
                    <Input 
                      type="text" 
                      id="successDescription" 
                      name="successDescription" 
                      value={localSettings.successDescription}
                      onChange={handleInputChange}
                      placeholder="This product is legitimate and original." 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successFooterText">Success Footer Text</Label>
                    <Input 
                      type="text" 
                      id="successFooterText" 
                      name="successFooterText" 
                      value={localSettings.successFooterText}
                      onChange={handleInputChange}
                      placeholder="This QR code has been marked as used and cannot be verified again." 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Failure State</CardTitle>
                  <CardDescription>
                    Customize what users see when verification fails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureBackground">Failure Background Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="failureBackground" 
                        name="failureBackground" 
                        value={localSettings.failureBackground}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.failureBackground}
                        name="failureBackground"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureText">Failure Text Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="failureText" 
                        name="failureText" 
                        value={localSettings.failureText}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.failureText}
                        name="failureText"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureIcon">Failure Icon Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="failureIcon" 
                        name="failureIcon" 
                        value={localSettings.failureIcon}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.failureIcon}
                        name="failureIcon"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureTitle">Failure Title</Label>
                    <Input 
                      type="text" 
                      id="failureTitle" 
                      name="failureTitle" 
                      value={localSettings.failureTitle}
                      onChange={handleInputChange}
                      placeholder="Not Authentic" 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureDescription">Failure Description</Label>
                    <Input 
                      type="text" 
                      id="failureDescription" 
                      name="failureDescription" 
                      value={localSettings.failureDescription}
                      onChange={handleInputChange}
                      placeholder="This product could not be verified as authentic." 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureFooterText">Failure Footer Text</Label>
                    <Input 
                      type="text" 
                      id="failureFooterText" 
                      name="failureFooterText" 
                      value={localSettings.failureFooterText}
                      onChange={handleInputChange}
                      placeholder="If you believe this is an error, please contact the manufacturer." 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Live Preview Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your verification page will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-2 bg-gray-100 text-sm font-medium text-center border-b">
                      Success Preview
                    </div>
                    <div 
                      className="p-4 flex flex-col items-center text-center space-y-3"
                      style={getPreviewBgStyle(true)}
                    >
                      {localSettings.logoUrl && (
                        <img 
                          src={localSettings.logoUrl} 
                          alt="Logo" 
                          className="h-8 mb-2"
                        />
                      )}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: localSettings.successIcon }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-bold">{localSettings.successTitle}</h3>
                      <p className="text-xs">{localSettings.successDescription}</p>
                      <div className="text-xs opacity-70">{localSettings.successFooterText}</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-2 bg-gray-100 text-sm font-medium text-center border-b">
                      Failure Preview
                    </div>
                    <div 
                      className="p-4 flex flex-col items-center text-center space-y-3"
                      style={getPreviewBgStyle(false)}
                    >
                      {localSettings.logoUrl && (
                        <img 
                          src={localSettings.logoUrl} 
                          alt="Logo" 
                          className="h-8 mb-2"
                        />
                      )}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: localSettings.failureIcon }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="font-bold">{localSettings.failureTitle}</h3>
                      <p className="text-xs">{localSettings.failureDescription}</p>
                      <div className="text-xs opacity-70">{localSettings.failureFooterText}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>
                    Set your brand colors for a consistent look
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="primaryColor" 
                        name="primaryColor" 
                        value={localSettings.primaryColor}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.primaryColor}
                        name="primaryColor"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="secondaryColor" 
                        name="secondaryColor" 
                        value={localSettings.secondaryColor}
                        onChange={handleInputChange}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={localSettings.secondaryColor}
                        name="secondaryColor"
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-y-2 pt-4">
                    <Label htmlFor="isRtl">Right-to-left Text Direction</Label>
                    <Switch 
                      id="isRtl" 
                      name="isRtl" 
                      checked={localSettings.isRtl}
                      onCheckedChange={(checked) => handleSwitchChange(checked, 'isRtl')}
                    />
                  </div>
                  
                  {/* Logo Upload Section */}
                  <div className="pt-4 border-t mt-4">
                    <Label className="block mb-2">Brand Logo</Label>
                    {localSettings.logoUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="border p-2 rounded-lg w-40 h-20 flex items-center justify-center">
                          <img 
                            src={localSettings.logoUrl} 
                            alt="Brand Logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocalSettings(prev => ({ ...prev, logoUrl: null }))}
                        >
                          Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Upload your logo in the Settings page
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                  <CardDescription>
                    See how your QR codes will look with these colors
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AspectRatio ratio={1/1} className="w-60">
                    <QRCodeTemplatePreview 
                      template="classic"
                      primaryColor={localSettings.primaryColor}
                      secondaryColor={localSettings.secondaryColor}
                      size={240}
                    />
                  </AspectRatio>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
                <CardDescription>
                  Configure how users can interact with your verification system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium">Enable Product Reviews</h3>
                    <p className="text-sm text-gray-500">Allow customers to leave product reviews after verification</p>
                  </div>
                  <Switch 
                    id="enableReviews" 
                    name="enableReviews" 
                    checked={localSettings.enableReviews}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'enableReviews')}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium">Enable Customer Feedback</h3>
                    <p className="text-sm text-gray-500">Allow customers to provide improvement suggestions</p>
                  </div>
                  <Switch 
                    id="enableFeedback" 
                    name="enableFeedback" 
                    checked={localSettings.enableFeedback}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'enableFeedback')}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/feedback'} 
                  >
                    Manage Reviews & Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      
        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomizeApp;
