
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import QRCodeManager from '@/components/QRCodeManager';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [displayQRCodes, setDisplayQRCodes] = useState<(QRCode & { dataUrl: string })[]>([]);
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
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

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">QR Code Authentication System</h1>
        <p className="text-lg text-muted-foreground">Generate, manage, and verify product authenticity</p>
      </header>
      
      <Tabs defaultValue="generate" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
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
        
        <TabsContent value="preview">
          <div className="flex flex-col space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-6 bg-green-50">
                <h2 className="text-xl font-semibold mb-4 text-center">Valid Product Page</h2>
                <div className="border-2 border-verified rounded-lg p-6 flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-verified rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-verified">Product Verified</h3>
                  <p className="text-center">This product is legitimate and original</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-red-50">
                <h2 className="text-xl font-semibold mb-4 text-center">Invalid Product Page</h2>
                <div className="border-2 border-counterfeit rounded-lg p-6 flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-counterfeit rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-counterfeit">Not Authentic</h3>
                  <p className="text-center">This product is not original or has been previously verified</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <QRCodeManager 
            qrCodes={qrCodes}
            onUpdateQRCode={handleUpdateQRCode}
            onRefresh={fetchQRCodes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
