import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Printer, Download, RefreshCw, Plus } from 'lucide-react';
import { generateQRCode, encryptData } from '@/utils/qrCodeUtils';
import { QRCode, TemplateType } from '@/types/qrCode';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
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
  const [singleProduct, setSingleProduct] = useState<string>("");
  const [bulkProducts, setBulkProducts] = useState<string[]>([]);
  const [template, setTemplate] = useState<TemplateType>("classic");
  const [headerText, setHeaderText] = useState<string>("Scan to Verify Authenticity");
  const [instructionText, setInstructionText] = useState<string>("Scan this QR code to verify that this product is authentic");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [footerText, setFooterText] = useState<string>("© 2023 seQRity Authentication - All rights reserved");
  const [directionRTL, setDirectionRTL] = useState<boolean>(false);
  
  // Loading state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Refs for form elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle tab switching
  const [activeTab, setActiveTab] = useState<string>("single");
  
  // Handle template preview
  const [previewQrValue] = useState<string>("https://example.com/verify/preview-code");
  
  // Handle file upload for bulk products
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      setBulkProducts(lines);
      toast.success(`Loaded ${lines.length} product codes`);
    };
    reader.readAsText(file);
  };
  
  // Generate QR codes
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      // Determine products to generate QR codes for
      let productsToGenerate: string[];
      
      if (activeTab === "single") {
        if (!singleProduct.trim()) {
          toast.error("Please enter a product identifier");
          return;
        }
        productsToGenerate = [singleProduct.trim()];
      } else {
        // Bulk generation
        if (bulkProducts.length === 0) {
          toast.error("Please upload a file with product identifiers");
          return;
        }
        productsToGenerate = bulkProducts;
      }
      
      // Limit the number of codes that can be generated at once
      const quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum < 1 || quantityNum > 1000) {
        toast.error("Quantity must be between 1 and 1000");
        return;
      }
      
      // If using bulk mode, ensure the number of codes is limited
      if (activeTab === "bulk" && productsToGenerate.length > 1000) {
        toast.error("Maximum 1000 codes can be generated at once");
        return;
      }
      
      // Repeat single product if quantity > 1
      if (activeTab === "single" && quantityNum > 1) {
        productsToGenerate = Array(quantityNum).fill(singleProduct.trim());
      }
      
      // Start generating QR codes
      const newQRCodes: QRCode[] = [];
      let currentSequentialNumber = lastSequentialNumber;
      
      // Process each product
      for (const product of productsToGenerate) {
        // Increment sequential number
        currentSequentialNumber++;
        
        // Create unique ID for this QR code
        const id = uuidv4();
        
        // Encrypt the product data
        const encryptedData = await encryptData(product);
        
        // Create verification URL
        const url = `${window.location.origin}/check?id=${id}`;
        
        // Generate QR code as data URL
        const dataUrl = await generateQRCode(url);
        
        // Create QR code object
        const qrCode: QRCode = {
          id,
          sequentialNumber: currentSequentialNumber.toString(),
          encryptedData,
          url,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
          dataUrl,
          template,
          headerText,
          instructionText,
          websiteUrl,
          footerText,
          directionRTL
        };
        
        newQRCodes.push(qrCode);
      }
      
      // Insert QR codes into database
      if (newQRCodes.length > 0) {
        const insertData = newQRCodes.map(qr => ({
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
          direction_rtl: qr.directionRTL
        }));
        
        const { error } = await supabase.from('qr_codes').insert(insertData);
        
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
        
        // Clear form for single product
        if (activeTab === "single") {
          setSingleProduct("");
        }
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Generate QR Codes</h2>
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
              <CardDescription>Generate single or multiple QR codes for product verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk</TabsTrigger>
                </TabsList>
                <TabsContent value="single" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="single-product">Product Identifier</Label>
                    <Input 
                      id="single-product"
                      placeholder="Enter product ID, serial number, or other identifier"
                      value={singleProduct}
                      onChange={(e) => setSingleProduct(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1" 
                      max="1000" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="bulk" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk-upload">Upload Product List</Label>
                    <div className="flex flex-col gap-2">
                      <Input 
                        id="bulk-file"
                        type="file" 
                        accept=".txt,.csv" 
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const text = event.target?.result as string;
                            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                            setBulkProducts(lines);
                            toast.success(`Loaded ${lines.length} product codes`);
                          };
                          reader.readAsText(file);
                        }}
                        className="hidden"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Select File
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled={bulkProducts.length === 0}
                          onClick={() => {
                            setBulkProducts([]);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                      </div>
                    </div>
                    {bulkProducts.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {bulkProducts.length} product identifiers loaded
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="pt-2">
                <details className="text-sm">
                  <summary className="font-medium cursor-pointer text-blue-600 hover:text-blue-800">
                    Customize QR code appearance and content
                  </summary>
                  <div className="pt-4 space-y-4">
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
                  </div>
                </details>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Generate QR {activeTab === "bulk" ? "Codes" : "Code"}
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
                qrCodeDataUrl={previewQrValue}
                headerText={headerText || ""}
                instructionText={instructionText || ""}
                websiteUrl={websiteUrl || ""}
                footerText={footerText || ""}
                directionRTL={directionRTL || false}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <p className="text-xs text-center text-muted-foreground">
                Preview of the {template} template
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Printer className="mr-1 h-3 w-3" /> Print
                </Button>
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
