import React, { useState, useEffect } from 'react';
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
import QRCodeTemplates, { TemplateType } from './QRCodeTemplates';
import QRCodeTemplatePreview from './QRCodeTemplatePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import html2canvas from 'html2canvas';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator = ({ onQRCodesGenerated, lastSequentialNumber }: QRCodeGeneratorProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://example.com');
  const [headerText, setHeaderText] = useState<string>('USE ORIGINAL PRODUCT!');
  const [instructionText, setInstructionText] = useState<string>('Scan the QR Code to check your product');
  const [footerText, setFooterText] = useState<string>('VOID IF REMOVED');
  const [directionRTL, setDirectionRTL] = useState<boolean>(false);
  const [previewQrCode, setPreviewQrCode] = useState<string>('');
  
  // Reference to the preview element for capturing
  const previewRef = React.useRef<HTMLDivElement>(null);
  
  const baseUrl = window.location.origin;
  
  useEffect(() => {
    // Generate a preview QR code when the form changes
    const generatePreview = async () => {
      try {
        const url = `${baseUrl}/product-check/?qr=preview`;
        const qrCodeDataUrl = await generateQRCode(url);
        setPreviewQrCode(qrCodeDataUrl);
      } catch (error) {
        console.error('Error generating preview QR code:', error);
      }
    };
    
    generatePreview();
  }, [selectedTemplate, baseUrl]);
  
  // Set RTL automatically when Arabic template is selected
  useEffect(() => {
    if (selectedTemplate === 'arabic') {
      setDirectionRTL(true);
      setHeaderText('استخدم المنتج الأصلي!');
      setInstructionText('امسح رمز الاستجابة السريعة للتحقق من منتجك');
      setFooterText('يصبح المنتج ملغياً إذا إزالته!');
    } else if (directionRTL && selectedTemplate !== 'arabic') {
      // Only reset if we're changing from Arabic to another template
      setDirectionRTL(false);
      setHeaderText('USE ORIGINAL PRODUCT!');
      setInstructionText('Scan the QR Code to check your product');
      setFooterText('VOID IF REMOVED');
    }
  }, [selectedTemplate, directionRTL]);
  
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
      
      // For capturing the complete QR code template with styling
      const generateQRTemplateImage = async () => {
        if (!previewRef.current) {
          console.error('Preview element not available');
          return null;
        }
        
        try {
          const canvas = await html2canvas(previewRef.current, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          return canvas.toDataURL('image/png');
        } catch (error) {
          console.error('Error capturing QR template:', error);
          return null;
        }
      };
      
      // Generate each QR code with proper template settings
      for (let i = 0; i < quantity; i++) {
        const seqNumber = startingNumber + i;
        const uniqueId = generateUniqueId();
        const sequentialNumber = formatSequentialNumber(seqNumber);
        
        // Generate raw encrypted data without URL encoding
        const encryptedData = encryptData(uniqueId);
        const url = `${baseUrl}/product-check/?qr=${encodeURIComponent(encryptedData)}`;
        const qrCodeDataUrl = await generateQRCode(url);
        
        // Use the selected template settings for all QR codes
        const qrCode: QRCode = {
          id: uniqueId,
          sequentialNumber,
          encryptedData,
          url,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
          scannedAt: null,
          dataUrl: qrCodeDataUrl,
          template: selectedTemplate,
          headerText,
          instructionText,
          websiteUrl,
          footerText,
          directionRTL,
        };
        
        generatedQRCodes.push(qrCode);
        
        // Prepare database insert with consistent format
        dbInserts.push({
          id: uniqueId,
          sequential_number: sequentialNumber,
          encrypted_data: encryptedData,
          url: url,
          data_url: qrCodeDataUrl,
          is_enabled: true,
          is_scanned: false,
          created_at: new Date().toISOString(),
          template: selectedTemplate,
          header_text: headerText,
          instruction_text: instructionText,
          website_url: websiteUrl,
          footer_text: footerText,
          direction_rtl: directionRTL,
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
        const firstQrCode = dbInserts[0];
        const verificationResult = await debugVerifyQRCodeInDatabase(firstQrCode.encrypted_data);
        console.log('Verification of first QR code after insertion:', verificationResult);
        
        if (!verificationResult.exists) {
          console.warn('QR code verification failed after insertion!', {
            encryptedData: firstQrCode.encrypted_data,
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
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="appearance">Appearance & Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <Input
                    id="websiteUrl"
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Next sequential number: {formatSequentialNumber(lastSequentialNumber + 1)}
              </div>
              
              <Button 
                onClick={handleGenerateQRCodes} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate QR Codes'}
              </Button>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <QRCodeTemplates 
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="headerText" className="block text-sm font-medium text-gray-700 mb-1">
                    Header Text
                  </label>
                  <Input
                    id="headerText"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="w-full"
                    placeholder="USE ORIGINAL PRODUCT!"
                    dir={directionRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <div>
                  <label htmlFor="instructionText" className="block text-sm font-medium text-gray-700 mb-1">
                    Instruction Text
                  </label>
                  <Input
                    id="instructionText"
                    value={instructionText}
                    onChange={(e) => setInstructionText(e.target.value)}
                    className="w-full"
                    placeholder="Scan the QR Code to check your product"
                    dir={directionRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <div>
                  <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-1">
                    Footer Text
                  </label>
                  <Input
                    id="footerText"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full"
                    placeholder="VOID IF REMOVED"
                    dir={directionRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="directionRTL"
                      checked={directionRTL}
                      onChange={(e) => setDirectionRTL(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="directionRTL" className="text-sm font-medium text-gray-700">
                      Right-to-Left (RTL) Direction
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="bg-white p-4 rounded" ref={previewRef}>
                  <QRCodeTemplatePreview
                    template={selectedTemplate}
                    qrCodeDataUrl={previewQrCode}
                    headerText={headerText}
                    instructionText={instructionText}
                    websiteUrl={websiteUrl}
                    footerText={footerText}
                    directionRTL={directionRTL}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
