
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { QRCode as QRCodeType } from '@/types/qrCode';
import { toast } from "sonner";
import QRCodeTemplatePreview from './QRCodeTemplatePreview';
import html2canvas from 'html2canvas';
import { formatSequentialNumber } from '@/utils/qrCodeUtils';

interface QRCodeDisplayProps {
  qrCodes: (QRCodeType & { dataUrl: string })[];
}

const QRCodeDisplay = ({ qrCodes }: QRCodeDisplayProps) => {
  // Create refs to access the QR code template elements
  const qrCodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const downloadQRCode = async (index: number, sequentialNumber: string | number) => {
    try {
      const element = qrCodeRefs.current[index];
      if (!element) {
        toast.error('Could not capture QR code frame');
        return;
      }

      toast.loading('Capturing QR code frame...');
      
      // Use html2canvas to capture the entire template as an image
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Better quality
        logging: false,
        useCORS: true
      });
      
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qrcode-${formatSequentialNumber(sequentialNumber.toString())}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`QR Code #${sequentialNumber} downloaded`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.dismiss();
      toast.error('Failed to download QR code');
    }
  };

  const downloadAllQRCodes = async () => {
    if (qrCodes.length === 0) return;
    
    toast.info(`Preparing ${qrCodes.length} QR codes for download...`);
    
    // Small delay to allow the toast to show
    setTimeout(() => {
      qrCodes.forEach((qrCode, index) => {
        // Stagger downloads slightly to prevent browser overload
        setTimeout(() => {
          downloadQRCode(index, qrCode.sequentialNumber);
        }, index * 500); // Increased delay between downloads
      });
    }, 500);
  };
  
  if (qrCodes.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">Generated QR codes will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Generated QR Codes</h2>
        <Button onClick={downloadAllQRCodes}>
          Download All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {qrCodes.map((qrCode, index) => (
          <Card key={qrCode.id} className="flex flex-col overflow-hidden">
            <CardContent className="p-4 flex-grow">
              <div 
                ref={el => qrCodeRefs.current[index] = el} 
                className="bg-white rounded"
              >
                <QRCodeTemplatePreview
                  template={qrCode.template || 'classic'}
                  qrCodeDataUrl={qrCode.dataUrl}
                  headerText={qrCode.headerText || ''}
                  instructionText={qrCode.instructionText || ''}
                  websiteUrl={qrCode.websiteUrl || ''}
                  footerText={qrCode.footerText || ''}
                  directionRTL={qrCode.directionRTL || false}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0">
              <Button 
                onClick={() => downloadQRCode(index, qrCode.sequentialNumber)}
                size="sm"
                variant="outline"
              >
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRCodeDisplay;
