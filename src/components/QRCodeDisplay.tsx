import React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, Printer, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatSequentialNumber } from '@/utils/qrCodeUtils';

interface QRCodeDisplayProps {
  qrCodes: Array<{
    id: string;
    sequentialNumber: string | number;
    dataUrl: string;
    template: string;
    headerText?: string;
    instructionText?: string;
    websiteUrl?: string;
    footerText?: string;
    directionRTL?: boolean;
  }>;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodes }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const handleDownload = (dataUrl: string, id: string, sequentialNumber: string | number) => {
    if (!dataUrl) {
      toast.error('QR code image is not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `QR-${formatSequentialNumber(Number(sequentialNumber))}-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded successfully');
  };
  
  const handleCopy = (dataUrl: string) => {
    if (!dataUrl) {
      toast.error('QR code data URL is not available');
      return;
    }
    
    navigator.clipboard.writeText(dataUrl)
      .then(() => toast.success('QR Code data URL copied to clipboard'))
      .catch(() => toast.error('Failed to copy QR Code data URL'));
  };
  
  const handlePrint = async (id: string) => {
    try {
      const qrCode = qrCodes.find(qr => qr.id === id);
      if (!qrCode || !qrCode.dataUrl) {
        toast.error('QR code data not found for printing');
        return;
      }

      const dataUrl = qrCode.dataUrl;
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Pop-up blocked. Please allow pop-ups for this site to print QR codes.');
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100vh; }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="QR Code" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();

      toast.success('Print window opened');
    } catch (error) {
      console.error('Error printing QR code:', error);
      toast.error('Failed to print QR code');
    }
  };

  const handleBulkPrint = async () => {
    if (qrCodes.length === 0) {
      toast.warning('No QR codes to print.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups for this site to print QR codes.');
      return;
    }

    let imagesHtml = '';
    qrCodes.forEach(qrCode => {
      if (qrCode.dataUrl) {
        // Basic styling for images in the print view
        imagesHtml += `
          <div style="margin: 10px; page-break-inside: avoid;">
            <img src="${qrCode.dataUrl}" alt="QR Code ${formatSequentialNumber(Number(qrCode.sequentialNumber))}" style="max-width: 250px; max-height: 400px; object-fit: contain;"/>
          </div>
        `;
      }
    });

    if (imagesHtml === '') {
      toast.warning('No printable QR code images found.');
      printWindow.close();
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Codes</title>
          <style>
            body { margin: 0; padding: 20px; }
            .print-container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
            img { display: block; }
            @media print {
              body { margin: 0; padding: 0; }
              .print-container { display: block; }
              .print-container div { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${imagesHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              }, 500);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    toast.success(`Print window opened for ${qrCodes.length} QR codes`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generated QR Codes</h2>
        <div className="flex gap-2 items-center">
          {qrCodes.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkPrint}
              className="ml-2"
            >
              <Printer className="h-4 w-4 mr-1" /> Print All ({qrCodes.length})
            </Button>
          )}
          <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className={`${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        {qrCodes.map((qrCode) => (
          <Card key={qrCode.id} className="overflow-hidden flex flex-col">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-center mb-2">
                <p className="font-medium">QR Code #{formatSequentialNumber(Number(qrCode.sequentialNumber))}</p>
              </div>
              
              <div className="w-full flex justify-center items-center mb-4">
                  <div 
                    id={`qr-template-${qrCode.id}`} 
                    className="w-full max-w-xs overflow-hidden rounded-lg shadow-md mx-auto"
                  >
                    <img
                      src={qrCode.dataUrl}
                      alt={`QR Code ${formatSequentialNumber(Number(qrCode.sequentialNumber))}`}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        console.error("Error loading generated QR code image:", qrCode.id);
                      }}
                    />
                  </div>
              </div>
              
              <div className="flex gap-2 mt-auto justify-center w-full">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(qrCode.dataUrl, qrCode.id, qrCode.sequentialNumber)}
                >
                  <ArrowDown className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(qrCode.dataUrl)}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePrint(qrCode.id)}
                >
                  <Printer className="h-4 w-4 mr-1" /> Print
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {qrCodes.length > 3 && (
        <div className="text-center mt-4">
          <p className="text-muted-foreground">
            {qrCodes.length} QR codes generated. Scroll to see more.
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
