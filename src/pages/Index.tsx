
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import QRCodeManager from '@/components/QRCodeManager';
import QRCodeAnalytics from '@/components/QRCodeAnalytics';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { FileText } from "lucide-react";
import { Button } from '@/components/ui/button';

const Index = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [displayQRCodes, setDisplayQRCodes] = useState<(QRCode & { dataUrl: string })[]>([]);
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('generate');
  
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
        const mappedQrCodes = data.map(qr => ({
          id: qr.id,
          sequentialNumber: qr.sequential_number,
          encryptedData: qr.encrypted_data,
          url: qr.url,
          isScanned: qr.is_scanned,
          isEnabled: qr.is_enabled,
          createdAt: qr.created_at,
          scannedAt: qr.scanned_at,
          dataUrl: qr.data_url
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Refresh data when switching to analytics or manage tab
    if (value === 'analytics' || value === 'manage') {
      fetchQRCodes();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">QR Code Authentication System</h1>
        <p className="text-lg text-muted-foreground">Generate, manage, and verify product authenticity</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-8">
          <QRCodeGenerator 
            onQRCodesGenerated={handleQRCodesGenerated}
            lastSequentialNumber={lastSequentialNumber}
          />
          
          {displayQRCodes.length > 0 && (
            <QRCodeDisplay qrCodes={displayQRCodes} />
          )}
        </TabsContent>
        
        <TabsContent value="manage">
          <QRCodeManager 
            qrCodes={qrCodes}
            onUpdateQRCode={handleUpdateQRCode}
            onRefresh={fetchQRCodes}
          />
        </TabsContent>
        
        <TabsContent value="customize">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Customize the App Experience</h2>
              <p className="text-muted-foreground max-w-lg">
                Configure the appearance of verification pages, enable reviews and feedback, and more.
              </p>
            </div>
            
            <div className="flex flex-col gap-6 w-full max-w-lg">
              <Link to="/customize" className="w-full">
                <Button className="w-full h-16 text-lg" size="lg">
                  App Appearance Settings
                </Button>
              </Link>
              
              <Link to="/admin/feedback" className="w-full">
                <Button className="w-full h-16 text-lg flex items-center justify-center" variant="outline" size="lg">
                  <FileText className="mr-2 h-5 w-5" />
                  View Reviews & Feedback
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <QRCodeAnalytics qrCodes={qrCodes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
