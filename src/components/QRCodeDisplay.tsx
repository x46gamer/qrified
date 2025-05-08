
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { QRCode as QRCodeType } from '@/types/qrCode';
import { toast } from "sonner";

interface QRCodeDisplayProps {
  qrCodes: QRCodeType[];
}

const QRCodeDisplay = ({ qrCodes }: QRCodeDisplayProps) => {
  const downloadQRCode = (dataUrl: string, sequentialNumber: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qrcode-${sequentialNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`QR Code #${sequentialNumber} downloaded`);
  };

  const downloadAllQRCodes = async () => {
    if (qrCodes.length === 0) return;
    
    toast.info(`Preparing ${qrCodes.length} QR codes for download...`);
    
    // Small delay to allow the toast to show
    setTimeout(() => {
      qrCodes.forEach((qrCode, index) => {
        // Stagger downloads slightly to prevent browser overload
        setTimeout(() => {
          downloadQRCode(qrCode.dataUrl, qrCode.sequentialNumber);
        }, index * 200);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {qrCodes.map((qrCode) => (
          <Card key={qrCode.id} className="flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col items-center justify-center">
              <img 
                src={qrCode.dataUrl} 
                alt={`QR Code ${qrCode.sequentialNumber}`} 
                className="w-full max-w-[200px]" 
              />
              <p className="mt-2 text-center font-semibold">#{qrCode.sequentialNumber}</p>
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0">
              <Button 
                onClick={() => downloadQRCode(qrCode.dataUrl, qrCode.sequentialNumber)}
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
