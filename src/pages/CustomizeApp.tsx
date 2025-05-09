
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
import { Loader2, Save } from 'lucide-react';
import QRCodeTemplatePreview from '@/components/QRCodeTemplatePreview';

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
    primaryColor,
    secondaryColor,
    updateSettings,
    isSaving
  } = useAppearanceSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const settings = {
      successBackground: formData.get('successBackground') as string,
      successText: formData.get('successText') as string,
      successIcon: formData.get('successIcon') as string,
      failureBackground: formData.get('failureBackground') as string,
      failureText: formData.get('failureText') as string,
      failureIcon: formData.get('failureIcon') as string,
      successTitle: formData.get('successTitle') as string,
      successDescription: formData.get('successDescription') as string,
      successFooterText: formData.get('successFooterText') as string,
      failureTitle: formData.get('failureTitle') as string,
      failureDescription: formData.get('failureDescription') as string,
      failureFooterText: formData.get('failureFooterText') as string,
      isRtl: formData.get('isRtl') === 'on',
      enableReviews: formData.get('enableReviews') === 'on',
      enableFeedback: formData.get('enableFeedback') === 'on',
      primaryColor: formData.get('primaryColor') as string,
      secondaryColor: formData.get('secondaryColor') as string,
    };
    
    await updateSettings(settings);
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Customize Your App</h1>
        <p className="text-lg text-muted-foreground">Personalize the appearance and behavior of your QR verification</p>
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
                        defaultValue={successBackground}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={successBackground} 
                        className="flex-1" 
                        readOnly
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
                        defaultValue={successText}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={successText} 
                        className="flex-1" 
                        readOnly
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
                        defaultValue={successIcon}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={successIcon} 
                        className="flex-1" 
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successTitle">Success Title</Label>
                    <Input 
                      type="text" 
                      id="successTitle" 
                      name="successTitle" 
                      defaultValue={successTitle}
                      placeholder="Product Verified" 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successDescription">Success Description</Label>
                    <Input 
                      type="text" 
                      id="successDescription" 
                      name="successDescription" 
                      defaultValue={successDescription}
                      placeholder="This product is legitimate and original." 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="successFooterText">Success Footer Text</Label>
                    <Input 
                      type="text" 
                      id="successFooterText" 
                      name="successFooterText" 
                      defaultValue={successFooterText}
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
                        defaultValue={failureBackground}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={failureBackground} 
                        className="flex-1" 
                        readOnly
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
                        defaultValue={failureText}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={failureText} 
                        className="flex-1" 
                        readOnly
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
                        defaultValue={failureIcon}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={failureIcon} 
                        className="flex-1" 
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureTitle">Failure Title</Label>
                    <Input 
                      type="text" 
                      id="failureTitle" 
                      name="failureTitle" 
                      defaultValue={failureTitle}
                      placeholder="Not Authentic" 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureDescription">Failure Description</Label>
                    <Input 
                      type="text" 
                      id="failureDescription" 
                      name="failureDescription" 
                      defaultValue={failureDescription}
                      placeholder="This product could not be verified as authentic." 
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="failureFooterText">Failure Footer Text</Label>
                    <Input 
                      type="text" 
                      id="failureFooterText" 
                      name="failureFooterText" 
                      defaultValue={failureFooterText}
                      placeholder="If you believe this is an error, please contact the manufacturer." 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
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
                        defaultValue={primaryColor}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={primaryColor} 
                        className="flex-1" 
                        readOnly
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
                        defaultValue={secondaryColor}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        defaultValue={secondaryColor} 
                        className="flex-1" 
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-y-2 pt-4">
                    <Label htmlFor="isRtl">Right-to-left Text Direction</Label>
                    <Switch id="isRtl" name="isRtl" defaultChecked={isRtl} />
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
                  <div className="w-60 h-60">
                    <QRCodeTemplatePreview 
                      template="classic"
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      size={240}
                    />
                  </div>
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
                  <Switch id="enableReviews" name="enableReviews" defaultChecked={enableReviews} />
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium">Enable Customer Feedback</h3>
                    <p className="text-sm text-gray-500">Allow customers to provide improvement suggestions</p>
                  </div>
                  <Switch id="enableFeedback" name="enableFeedback" defaultChecked={enableFeedback} />
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
