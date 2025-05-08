
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  generateUniqueId, 
  encryptData, 
  generateQRCode, 
  formatSequentialNumber 
} from '@/utils/qrCodeUtils';
import { QRCode } from '@/types/qrCode';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator = ({ onQRCodesGenerated, lastSequentialNumber }: QRCodeGeneratorProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const baseUrl = window.location.origin;
  const currentSequentialNumber = useRef<number>(lastSequentialNumber);
  
  const handleGenerateQRCodes = async () => {
    if (quantity <= 0) {
      toast.error('Please enter a quantity greater than 0');
      return;
    }
    
    if (quantity > 100) {
      toast.error('Please generate 100 or fewer QR codes at a time');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const generatedQRCodes: QRCode[] = [];
      
      for (let i = 0; i < quantity; i++) {
        const nextNumber = currentSequentialNumber.current + 1;
        const uniqueId = generateUniqueId();
        const sequentialNumber = formatSequentialNumber(nextNumber);
        const encryptedData = encryptData(uniqueId);
        const url = `${baseUrl}/product-check/?qr=${encryptedData}`;
        const qrCodeDataUrl = await generateQRCode(url);
        
        generatedQRCodes.push({
          id: uniqueId,
          sequentialNumber,
          encryptedData,
          url,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
        });
        
        currentSequentialNumber.current = nextNumber;
      }
      
      onQRCodesGenerated(generatedQRCodes);
      toast.success(`${quantity} QR code(s) generated successfully`);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-center">Generate QR Codes</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (1-100)
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleGenerateQRCodes} 
              disabled={isGenerating}
              className="px-8"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Next sequential number: {formatSequentialNumber(currentSequentialNumber.current + 1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
