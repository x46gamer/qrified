
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import QRCodeManager from '@/components/QRCodeManager';
import QRCodeAnalytics from '@/components/QRCodeAnalytics';
import { AppearanceSettings } from '@/components/AppearanceSettings';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { TemplateType } from '@/components/QRCodeTemplates';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [displayQRCodes, setDisplayQRCodes] = useState<(QRCode & { dataUrl: string })[]>([]);
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('generate');
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Load QR codes from Supabase on mount
  useEffect(() => {
    fetchQRCodes();
    fetchLastSequentialNumber();
  }, []);
  
  const fetchQRCodes = async () => {
    setIsLoading(true);
    try {
      // Fetch all QR codes
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('sequential_number', { ascending: false });
      
      if (error) {
        console.error('Error fetching QR codes:', error);
        toast.error('Failed to fetch QR codes');
        return;
      }
      
      if (data) {
        // Map database fields to our app's QRCode type
        const mappedQrCodes: QRCode[] = data.map(qr => ({
          id: qr.id,
          sequentialNumber: qr.sequential_number,
          encryptedData: qr.encrypted_data,
          url: qr.url,
          isScanned: qr.is_scanned,
          isEnabled: qr.is_enabled,
          createdAt: qr.created_at,
          scannedAt: qr.scanned_at,
          dataUrl: qr.data_url,
          template: qr.template as TemplateType,
          headerText: qr.header_text,
          instructionText: qr.instruction_text,
          websiteUrl: qr.website_url,
          footerText: qr.footer_text,
          directionRTL: qr.direction_rtl,
        }));
        
        setQRCodes(mappedQrCodes);
        console.log('Fetched QR codes:', mappedQrCodes);
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('An error occurred while loading QR codes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchLastSequentialNumber = async () => {
    try {
      // Fetch the current counter value
      const { data, error } = await supabase
        .from('sequence_counters')
        .select('current_value')
        .eq('id', 'qr_code_sequential')
        .single();
      
      if (error) {
        console.error('Error fetching counter:', error);
        return;
      }
      
      if (data) {
        setLastSequentialNumber(data.current_value);
      }
    } catch (error) {
      console.error('Error loading sequence counter:', error);
    }
  };
  
  const handleQRCodesGenerated = async (newQRCodes: QRCode[]) => {
    // Update the state with the new QR codes
    setQRCodes([...newQRCodes, ...qrCodes]);
    
    // Update the last sequential number
    if (newQRCodes.length > 0) {
      await fetchLastSequentialNumber();
    }
    
    // Set the display QR codes
    const codesWithDataUrls = newQRCodes.map(code => ({
      ...code,
      dataUrl: code.dataUrl || ''
    }));
    
    setDisplayQRCodes(codesWithDataUrls);
  };
  
  const handleUpdateQRCode = (updatedQRCode: QRCode) => {
    setQRCodes(
      qrCodes.map((qrCode) => 
        qrCode.id === updatedQRCode.id ? updatedQRCode : qrCode
      )
    );
  };

  const handleDeleteQRCode = (id: string) => {
    setQRCodes(qrCodes.filter(qrCode => qrCode.id !== id));
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Refresh data when switching to analytics or manage tab
    if (value === 'analytics' || value === 'manage') {
      fetchQRCodes();
    }
  };

  // Determine which tabs to show based on user role
  const renderTabs = () => {
    if (isAdmin) {
      return (
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-5">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      );
    } else {
      return (
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-1">
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">QR Code Authentication System</h1>
        <p className="text-lg text-muted-foreground">Generate, manage, and verify product authenticity</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        {renderTabs()}
        
        <TabsContent value="generate" className="space-y-8">
          <QRCodeGenerator 
            onQRCodesGenerated={handleQRCodesGenerated}
            lastSequentialNumber={lastSequentialNumber}
          />
          
          {displayQRCodes.length > 0 && (
            <QRCodeDisplay qrCodes={displayQRCodes} />
          )}
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="manage">
              <QRCodeManager 
                qrCodes={qrCodes}
                onUpdateQRCode={handleUpdateQRCode}
                onRefresh={fetchQRCodes}
                onDeleteQRCode={handleDeleteQRCode}
              />
            </TabsContent>
            
            <TabsContent value="customize">
              <AppearanceSettings />
            </TabsContent>
            
            <TabsContent value="analytics">
              <QRCodeAnalytics qrCodes={qrCodes} />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>Manage your team and system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium">Team Management</h3>
                          <p className="text-sm text-gray-500">Add, edit or remove team members</p>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h4 className="font-medium">Employee User</h4>
                            <p className="text-sm text-gray-500">employee@example.com</p>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        
                        <div className="mt-4">
                          <Label htmlFor="new-member">Add Team Member</Label>
                          <div className="flex gap-2 mt-1">
                            <Input id="new-member" placeholder="Email address" />
                            <Button>Add</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">System Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input id="company-name" defaultValue="My Company" className="mt-1" />
                        </div>
                        
                        <div>
                          <Label htmlFor="default-template">Default QR Template</Label>
                          <select 
                            id="default-template"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          >
                            <option value="classic">Classic</option>
                            <option value="modern-blue">Modern Blue</option>
                            <option value="modern-beige">Modern Beige</option>
                            <option value="arabic">Arabic</option>
                          </select>
                        </div>
                        
                        <Button>Save Settings</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Index;
