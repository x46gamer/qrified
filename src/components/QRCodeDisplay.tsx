
import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeData } from '@/types/qrCode';
import html2canvas from 'html2canvas';

interface QRCodeDisplayProps {
  data: QRCodeData;
  showDownload?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  showDownload = true,
  className,
  style,
}) => {
  const { productName, productId, description, template, uniqueId } = data;
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  
  const downloadQRCode = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const canvas = await html2canvas(qrCodeRef.current, {
        backgroundColor: null,
        scale: 3,
      });
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `qrcode-${uniqueId || productId || 'seqrity'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const getTemplate = () => {
    switch (template) {
      case 'classic':
        return (
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
            <QRCodeSVG 
              value={`https://seqrity.com/check?id=${uniqueId}`}
              size={150}
              level="H"
              includeMargin={true}
              className="mb-2"
            />
            {productName && <p className="font-semibold text-center mt-2">{productName}</p>}
            <p className="text-xs text-gray-500 text-center">{uniqueId || productId}</p>
          </div>
        );
      
      case 'modern':
        return (
          <div className="flex flex-col items-center p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <QRCodeSVG 
                value={`https://seqrity.com/check?id=${uniqueId}`}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>
            {productName && <p className="font-semibold text-center mt-3">{productName}</p>}
            <p className="text-xs text-gray-600 text-center mt-1">{uniqueId || productId}</p>
          </div>
        );
      
      case 'minimal':
        return (
          <div className="flex flex-col items-center p-4">
            <QRCodeSVG 
              value={`https://seqrity.com/check?id=${uniqueId}`}
              size={150}
              level="H"
              includeMargin={true}
            />
            {productName && <p className="font-medium text-center mt-3">{productName}</p>}
            <p className="text-xs text-gray-500 text-center mt-1">{uniqueId || productId}</p>
          </div>
        );
      
      case 'business':
        return (
          <div className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-100 to-white border border-gray-200 rounded-lg">
            <div className="mb-3">
              <img src="/placeholder.svg" alt="Logo" className="h-8" />
            </div>
            <QRCodeSVG 
              value={`https://seqrity.com/check?id=${uniqueId}`}
              size={150}
              level="H"
              includeMargin={true}
            />
            {productName && <p className="font-semibold text-center mt-3">{productName}</p>}
            <p className="text-xs text-gray-600 text-center">{uniqueId || productId}</p>
            {description && <p className="text-xs text-center text-gray-500 mt-1 max-w-xs">{description}</p>}
          </div>
        );
      
      case 'arabic':
        return (
          <div className="flex flex-col items-center p-5 bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg" dir="rtl">
            <div className="mb-3">
              <img src="/placeholder.svg" alt="Logo" className="h-8" />
            </div>
            <QRCodeSVG 
              value={`https://seqrity.com/check?id=${uniqueId}`}
              size={150}
              level="H"
              includeMargin={true}
            />
            {productName && <p className="font-semibold text-center mt-3">{productName}</p>}
            <p className="text-xs text-gray-600 text-center">{uniqueId || productId}</p>
            {description && <p className="text-xs text-center text-gray-500 mt-1 max-w-xs">{description}</p>}
            <p className="text-sm font-medium mt-2 text-amber-800">تحقق من أصالة المنتج</p>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center p-4">
            <QRCodeSVG 
              value={`https://seqrity.com/check?id=${uniqueId}`}
              size={150}
              level="H"
              includeMargin={true}
            />
            {productName && <p className="font-medium text-center mt-2">{productName}</p>}
            <p className="text-xs text-gray-500">{uniqueId || productId}</p>
          </div>
        );
    }
  };

  return (
    <Card className={cn("flex flex-col overflow-hidden", className)} style={style}>
      <CardContent className="flex-1 p-4 flex items-center justify-center" ref={qrCodeRef}>
        {getTemplate()}
      </CardContent>
      
      {showDownload && (
        <CardFooter className="flex justify-center p-2 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadQRCode}
            className="w-full text-xs"
          >
            <Download className="h-3 w-3 mr-1" /> Download
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QRCodeDisplay;
