
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import QRCodeManager from '@/components/QRCodeManager';
import QRCodeAnalytics from '@/components/QRCodeAnalytics';
import { AppearanceSettings } from '@/components/AppearanceSettings';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { TemplateType } from '@/components/QRCodeTemplates';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [displayQRCodes, setDisplayQRCodes] = useState<(QRCode & { dataUrl: string })[]>([]);
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'generate';
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Load QR codes from Supabase on mount
  useEffect(() => {
    if (user) {
      fetchQRCodes();
      fetchLastSequentialNumber();
    }
  }, [user]);
  
  const fetchQRCodes = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch QR codes (Row Level Security will restrict to only user's codes or all for admins)
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('sequential_number', { ascending: false });
      
      if (error) {
        console.error('Error fetching QR codes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch QR codes",
          variant: "destructive"
        });
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
          userId: qr.user_id,
        }));
        
        setQRCodes(mappedQrCodes);
        console.log('Fetched QR codes:', mappedQrCodes);
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading QR codes",
        variant: "destructive"
      });
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
    // Make sure the user ID is set for new QR codes
    const userQRCodes = newQRCodes.map(code => ({
      ...code,
      userId: user?.id,
    }));
    
    // Update the state with the new QR codes
    setQRCodes(prevQrCodes => [...userQRCodes, ...prevQrCodes]);
    
    // Update the last sequential number
    if (userQRCodes.length > 0) {
      await fetchLastSequentialNumber();
    }
    
    // Set the display QR codes
    const codesWithDataUrls = userQRCodes.map(code => ({
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
    setSearchParams({ tab: value });
    // Refresh data when switching to analytics or manage tab
    if (value === 'analytics' || value === 'manage') {
      fetchQRCodes();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Generate, manage, and verify product authenticity</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsContent value="generate" className="space-y-8 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <QRCodeGenerator 
              onQRCodesGenerated={handleQRCodesGenerated}
              lastSequentialNumber={lastSequentialNumber}
            />
          </div>
          
          {displayQRCodes.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <QRCodeDisplay qrCodes={displayQRCodes} />
            </div>
          )}
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="manage" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <QRCodeManager 
                  qrCodes={qrCodes}
                  onUpdateQRCode={handleUpdateQRCode}
                  onRefresh={fetchQRCodes}
                  onDeleteQRCode={handleDeleteQRCode}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="customize" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <AppearanceSettings />
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <QRCodeAnalytics qrCodes={qrCodes} />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader>
                    <CardTitle>Admin Settings</CardTitle>
                    <CardDescription>Manage your team and system settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-white/50 transition-shadow hover:shadow-md">
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
                      
                      <div className="border rounded-lg p-4 bg-white/50 transition-shadow hover:shadow-md">
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
                          
                          <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                            Save Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage team members and their access levels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white/50 rounded-lg p-6 shadow-sm">
                      <h3 className="font-medium mb-4 text-lg">Team Members</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-medium">Admin User</p>
                            <p className="text-sm text-gray-500">admin@seqrity.com</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Admin</span>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-medium">Employee User</p>
                            <p className="text-sm text-gray-500">employee@seqrity.com</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Employee</span>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Invite New Member</h4>
                        <div className="flex gap-2">
                          <Input placeholder="Email address" className="flex-1" />
                          <select 
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option>Admin</option>
                            <option>Employee</option>
                          </select>
                          <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                            Send Invite
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-6 shadow-sm">
                      <h3 className="font-medium mb-2 text-lg">Permission Settings</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Configure what each role can access in the system
                      </p>
                      
                      <div className="space-y-2">
                        <div className="bg-white p-4 rounded-md border">
                          <h4 className="font-medium mb-2">Employee Permissions</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Generate QR codes</span>
                              <input type="checkbox" checked disabled className="h-4 w-4 rounded border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Manage QR codes</span>
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Access analytics</span>
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="mt-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                        Save Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Index;
