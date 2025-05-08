
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  generateUniqueId, 
  encryptData, 
  generateQRCode, 
  formatSequentialNumber,
  debugVerifyQRCodeInDatabase
} from '@/utils/qrCodeUtils';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator = ({ onQRCodesGenerated, lastSequentialNumber }: QRCodeGeneratorProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const baseUrl = window.location.origin;
  
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
      // Get the current counter value first
      const { data: counterData, error: counterError } = await supabase
        .from('sequence_counters')
        .select('current_value')
        .eq('id', 'qr_code_sequential')
        .single();
      
      if (counterError) {
        console.error('Error getting counter:', counterError);
        toast.error('Failed to generate QR codes: Counter error');
        setIsGenerating(false);
        return;
      }
      
      // Calculate the new counter value
      const currentValue = counterData?.current_value || lastSequentialNumber;
      const newValue = currentValue + quantity;
      
      // Update the counter
      const { error: updateError } = await supabase
        .from('sequence_counters')
        .update({ current_value: newValue })
        .eq('id', 'qr_code_sequential');
      
      if (updateError) {
        console.error('Error updating counter:', updateError);
        toast.error('Failed to generate QR codes: Counter update error');
        setIsGenerating(false);
        return;
      }
      
      // Calculate the starting sequential number
      const startingNumber = currentValue + 1;
      
      const generatedQRCodes: QRCode[] = [];
      const dbInserts = [];
      
      for (let i = 0; i < quantity; i++) {
        const seqNumber = startingNumber + i;
        const uniqueId = generateUniqueId();
        const sequentialNumber = formatSequentialNumber(seqNumber);
        const encryptedData = encryptData(uniqueId);
        const url = `${baseUrl}/product-check/?qr=${encryptedData}`;
        const qrCodeDataUrl = await generateQRCode(url);
        
        const qrCode = {
          id: uniqueId,
          sequentialNumber,
          encryptedData,
          url,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
          dataUrl: qrCodeDataUrl,
        };
        
        generatedQRCodes.push(qrCode);
        
        // Prepare database insert
        dbInserts.push({
          id: uniqueId,
          sequential_number: sequentialNumber,
          encrypted_data: encryptedData,
          url: url,
          data_url: qrCodeDataUrl,
          is_enabled: true,
          is_scanned: false,
          created_at: new Date().toISOString()
        });
      }
      
      console.log('Inserting QR codes to database:', dbInserts);
      
      // Insert all QR codes into the database
      const { error: insertError, data: insertedData } = await supabase
        .from('qr_codes')
        .insert(dbInserts)
        .select();
      
      if (insertError) {
        console.error('Error inserting QR codes:', insertError);
        toast.error('Failed to save QR codes to database');
        setIsGenerating(false);
        return;
      }
      
      console.log('Successfully inserted QR codes:', insertedData);
      
      // Verify the first QR code was actually stored
      if (dbInserts.length > 0) {
        const verificationResult = await debugVerifyQRCodeInDatabase(dbInserts[0].encrypted_data);
        console.log('Verification of first QR code after insertion:', verificationResult);
        
        if (!verificationResult.exists) {
          console.warn('QR code verification failed after insertion!', {
            encryptedData: dbInserts[0].encrypted_data,
            result: verificationResult
          });
        }
      }
      
      onQRCodesGenerated(generatedQRCodes);
      toast.success(`${quantity} QR code(s) generated successfully`);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
            Next sequential number: {formatSequentialNumber(lastSequentialNumber + 1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
