
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { QRCode as QRCodeType } from '@/types/qrCode';
import html2canvas from 'html2canvas';

interface QRCodeDisplayProps {
  qrCodes: (QRCodeType & { dataUrl: string })[];
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodes }) => {
  const downloadQRCode = async (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qr-code-${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const printQRCodes = async () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Codes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .qr-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .qr-item {
              border: 1px solid #ddd;
              padding: 15px;
              text-align: center;
              page-break-inside: avoid;
            }
            .qr-img {
              max-width: 150px;
              height: auto;
            }
            .qr-info {
              margin-top: 10px;
              font-size: 12px;
            }
            @media print {
              @page {
                size: auto;
                margin: 0.5cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-grid">
            ${qrCodes.map((qr) => `
              <div class="qr-item">
                <img src="${qr.dataUrl}" class="qr-img" alt="QR Code" />
                <div class="qr-info">
                  <strong>ID:</strong> ${qr.sequentialNumber}
                </div>
              </div>
            `).join('')}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const saveAsPDF = async () => {
    const element = document.getElementById('qr-codes-container');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qr-codes-' + new Date().toISOString().split('T')[0] + '.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Generated QR Codes</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={printQRCodes}>
            <Printer className="h-4 w-4 mr-2" />
            Print All
          </Button>
          <Button variant="outline" onClick={saveAsPDF}>
            <Download className="h-4 w-4 mr-2" />
            Save as Image
          </Button>
        </div>
      </div>
      
      <div id="qr-codes-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {qrCodes.map((qr) => (
          <Card key={qr.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-violet-50 p-4">
              <CardTitle className="text-center text-md">QR Code #{String(qr.sequentialNumber)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6">
              <div className="mb-4">
                <img src={qr.dataUrl} alt="QR Code" className="h-48 w-48" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadQRCode(qr.dataUrl, String(qr.sequentialNumber))}
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRCodeDisplay;
