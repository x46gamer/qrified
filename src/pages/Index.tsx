
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import QRCodeManager from '@/components/QRCodeManager';
import { QRCode } from '@/types/qrCode';
import { generateQRCode } from '@/utils/qrCodeUtils';

const Index = () => {
  // In a real application, this would come from a database
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [displayQRCodes, setDisplayQRCodes] = useState<(QRCode & { dataUrl: string })[]>([]);
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedQRCodes = localStorage.getItem('qrCodes');
    const savedLastNumber = localStorage.getItem('lastSequentialNumber');
    
    if (savedQRCodes) {
      setQRCodes(JSON.parse(savedQRCodes));
    }
    
    if (savedLastNumber) {
      setLastSequentialNumber(parseInt(savedLastNumber));
    }
  }, []);
  
  // Save to localStorage when qrCodes change
  useEffect(() => {
    localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
  }, [qrCodes]);
  
  // Save last sequential number when it changes
  useEffect(() => {
    localStorage.setItem('lastSequentialNumber', lastSequentialNumber.toString());
  }, [lastSequentialNumber]);
  
  const handleQRCodesGenerated = async (newQRCodes: QRCode[]) => {
    // Update the state with the new QR codes
    setQRCodes([...newQRCodes, ...qrCodes]);
    
    // Update the last sequential number
    if (newQRCodes.length > 0) {
      const lastCode = newQRCodes[0];
      setLastSequentialNumber(parseInt(lastCode.sequentialNumber));
    }
    
    // Generate dataUrls for display
    const codesWithDataUrls = await Promise.all(
      newQRCodes.map(async (code) => {
        const dataUrl = await generateQRCode(code.url);
        return { ...code, dataUrl };
      })
    );
    
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
