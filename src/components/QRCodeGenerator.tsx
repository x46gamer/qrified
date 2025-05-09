
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Download, RefreshCw } from 'lucide-react';
import { generateQRCode, encryptData } from '@/utils/qrCodeUtils';
import { QRCode } from '@/types/qrCode';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
import { TemplateType } from './QRCodeTemplates';
import QRCodeTemplatePreview from './QRCodeTemplatePreview';
import { v4 as uuidv4 } from 'uuid';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodesGenerated, lastSequentialNumber }) => {
  // Get appearance settings
  const theme = useAppearanceSettings();

  // Form state
  const [quantity, setQuantity] = useState<string>("1");
  const [productIdentifier, setProductIdentifier] = useState<string>("");
  const [template, setTemplate] = useState<TemplateType>("classic");
  const [headerText, setHeaderText] = useState<string>("Scan to Verify Authenticity");
  const [instructionText, setInstructionText] = useState<string>("Scan this QR code to verify that this product is authentic");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [footerText, setFooterText] = useState<string>("© 2023 seQRity Authentication - All rights reserved");
  const [directionRTL, setDirectionRTL] = useState<boolean>(false);
  const [arabicHeaderText, setArabicHeaderText] = useState<string>("تحقق من المنتج");
  const [arabicInstructionText, setArabicInstructionText] = useState<string>("امسح رمز QR للتحقق من صحة المنتج");
  const [arabicFooterText, setArabicFooterText] = useState<string>("شكراً لاختيارك منتجاتنا");
  
  // Loading state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Handle template preview
  const [previewQrValue] = useState<string>("https://example.com/verify/preview-code");
  
  // Update text based on selected template
  React.useEffect(() => {
    if (template === 'arabic') {
      setDirectionRTL(true);
    }
  }, [template]);
  
  // Generate QR codes
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      // Determine products to generate QR codes for
      let productToGenerate = productIdentifier.trim() || `product-${Date.now()}`;
      
      // Limit the number of codes that can be generated at once
      const quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum < 1 || quantityNum > 100) {
        toast.error('Quantity must be between 1 and 100');
        return;
      }
      
      // Start generating QR codes
      const newQRCodes: QRCode[] = [];
      let currentSequentialNumber = lastSequentialNumber;
      
      // Generate the requested quantity of codes
      for (let i = 0; i < quantityNum; i++) {
        // Increment sequential number
        currentSequentialNumber++;
        
        // Create unique ID for this QR code
        const id = uuidv4();
        
        // Encrypt the product data
        const fullProductId = quantityNum > 1 ? `${productToGenerate}-${i+1}` : productToGenerate;
        const encryptedData = await encryptData(fullProductId);
        
        // Create verification URL
        const url = `${window.location.origin}/check?id=${id}`;
        
        // Generate QR code as data URL
        const qrOptions = {
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        };
        const dataUrl = await generateQRCode(url, qrOptions);
        
        // Set texts based on template
        const useArabic = template === 'arabic';
        
        // Create QR code object
        const qrCode: QRCode = {
          id,
          sequentialNumber: currentSequentialNumber.toString(),
          encryptedData,
          url,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
          scannedAt: undefined,
          dataUrl,
          template,
          headerText: useArabic ? arabicHeaderText : headerText,
          instructionText: useArabic ? arabicInstructionText : instructionText,
          websiteUrl,
          footerText: useArabic ? arabicFooterText : footerText,
          directionRTL: useArabic ? true : directionRTL
        };
        
        newQRCodes.push(qrCode);
      }
      
      // Insert QR codes into database
      if (newQRCodes.length > 0) {
        // Map QR codes to match database schema
        const dbQRCodes = newQRCodes.map(qr => ({
          id: qr.id,
          sequential_number: qr.sequentialNumber.toString(),
          encrypted_data: qr.encryptedData,
          url: qr.url,
          is_scanned: qr.isScanned,
          is_enabled: qr.isEnabled,
          data_url: qr.dataUrl,
          template: qr.template,
          header_text: qr.headerText,
          instruction_text: qr.instructionText,
          website_url: qr.websiteUrl,
          footer_text: qr.footerText,
          direction_rtl: qr.directionRTL,
          arabic_header_text: template === 'arabic' ? arabicHeaderText : null,
          arabic_instruction_text: template === 'arabic' ? arabicInstructionText : null,
          arabic_footer_text: template === 'arabic' ? arabicFooterText : null
        }));
        
        const { error } = await supabase.from('qr_codes').insert(dbQRCodes);
        
        if (error) {
          throw error;
        }
        
        // Update sequence counter
        await supabase.from('sequence_counters')
          .update({ current_value: currentSequentialNumber })
          .eq('id', 'qr_code_sequential');
        
        // Notify parent component about new QR codes
        onQRCodesGenerated(newQRCodes);
        
        toast.success(`Successfully generated ${newQRCodes.length} QR codes`);
        
        // Clear form
        setProductIdentifier("");
      }
    } catch (error) {
      console.error("Error generating QR codes:", error);
      toast.error("Failed to generate QR codes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Generate QR Codes</h2>
          <p className="text-muted-foreground">Create secure QR codes for product authentication</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={template} 
            onValueChange={(value) => setTemplate(value as TemplateType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="modern-blue">Modern Blue</SelectItem>
              <SelectItem value="modern-beige">Modern Beige</SelectItem>
              <SelectItem value="arabic">Arabic (RTL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>QR Code Generator</CardTitle>
              <CardDescription>Generate QR codes for product verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-identifier">Product Identifier (Optional)</Label>
                  <Input 
                    id="product-identifier"
                    placeholder="Enter product ID, serial number, or other identifier"
                    value={productIdentifier}
                    onChange={(e) => setProductIdentifier(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">If left blank, a unique ID will be generated</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (1-100)</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <details className="text-sm">
                  <summary className="font-medium cursor-pointer text-blue-600 hover:text-blue-800">
                    Customize QR code appearance and content
                  </summary>
                  <div className="pt-4 space-y-4">
                    {template === 'arabic' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="arabic-header-text">Header Text (Arabic)</Label>
                          <Input 
                            id="arabic-header-text"
                            value={arabicHeaderText}
                            onChange={(e) => setArabicHeaderText(e.target.value)}
                            placeholder="Header text for the verification page"
                            dir="rtl"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="arabic-instruction-text">Instruction Text (Arabic)</Label>
                          <Input 
                            id="arabic-instruction-text"
                            value={arabicInstructionText}
                            onChange={(e) => setArabicInstructionText(e.target.value)}
                            placeholder="Instructions for the user"
                            dir="rtl"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website-url">Website URL (optional)</Label>
                          <Input 
                            id="website-url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="Link to your website"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="arabic-footer-text">Footer Text (Arabic)</Label>
                          <Input 
                            id="arabic-footer-text"
                            value={arabicFooterText}
                            onChange={(e) => setArabicFooterText(e.target.value)}
                            placeholder="Copyright or additional information"
                            dir="rtl"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="header-text">Header Text</Label>
                          <Input 
                            id="header-text"
                            value={headerText}
                            onChange={(e) => setHeaderText(e.target.value)}
                            placeholder="Header text for the verification page"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instruction-text">Instruction Text</Label>
                          <Input 
                            id="instruction-text"
                            value={instructionText}
                            onChange={(e) => setInstructionText(e.target.value)}
                            placeholder="Instructions for the user"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website-url">Website URL (optional)</Label>
                          <Input 
                            id="website-url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="Link to your website"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="footer-text">Footer Text</Label>
                          <Input 
                            id="footer-text"
                            value={footerText}
                            onChange={(e) => setFooterText(e.target.value)}
                            placeholder="Copyright or additional information"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="rtl" 
                            checked={directionRTL} 
                            onChange={(e) => setDirectionRTL(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="rtl">Right-to-left text direction (for Arabic, Hebrew, etc.)</Label>
                        </div>
                      </>
                    )}
                  </div>
                </details>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Generate QR {parseInt(quantity) > 1 ? "Codes" : "Code"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Preview</CardTitle>
              <CardDescription>QR code template preview</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <QRCodeTemplatePreview 
                template={template}
                qrCodeDataUrl=""
                headerText={template === 'arabic' ? arabicHeaderText : headerText}
                instructionText={template === 'arabic' ? arabicInstructionText : instructionText}
                websiteUrl={websiteUrl}
                footerText={template === 'arabic' ? arabicFooterText : footerText}
                directionRTL={template === 'arabic' ? true : directionRTL}
                size={180}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <p className="text-xs text-center text-muted-foreground">
                Preview of the {template} template
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="mr-1 h-3 w-3" /> Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
