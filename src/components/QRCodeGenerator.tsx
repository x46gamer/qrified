import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Copy, Loader2, PlusCircle, RefreshCw } from "lucide-react";
import {
  generateQRCode,
  encryptData,
  generateUniqueId,
  formatSequentialNumber
} from '@/utils/qrCodeUtils';
import { QRCode as QRCodeType } from '@/types/qrCode';
import { TemplateType } from '@/components/QRCodeTemplates';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';

interface QRCode {
  id: string;
  sequentialNumber: string | number;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  dataUrl: string;
  template: TemplateType;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
  arabicHeaderText?: string;
  arabicInstructionText?: string;
  arabicFooterText?: string;
}

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodesGenerated, lastSequentialNumber }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState<number | undefined>(1);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [headerText, setHeaderText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [footerText, setFooterText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { primaryColor, secondaryColor } = useAppearanceSettings();
  
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  
  const toggleAdvancedSettings = () => {
    setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen);
  };
  
  const handleCopyClick = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  }, []);
  
  const generateQRCodes = async () => {
  try {
    setIsGenerating(true);
    setErrorMessage('');

    // Validate fields first
    if (!quantity || quantity <= 0) {
      setErrorMessage('Please enter a valid quantity');
      return;
    }

    const newQRCodes: QRCode[] = [];
    const qrPromises: Promise<QRCode>[] = [];

    for (let i = 0; i < quantity; i++) {
      // Increment the sequential number
      const sequentialNumber = lastSequentialNumber + i + 1;
      const formattedSeqNumber = formatSequentialNumber(sequentialNumber);
      
      // Generate a unique ID for the QR code
      const uniqueId = generateUniqueId();
      
      // Create the QR code data (information to be encoded)
      const qrData = {
        id: uniqueId,
        seq: formattedSeqNumber,
        product: productName || 'Unknown Product',
        timestamp: Date.now().toString(),
      };
      
      // Encrypt the data for security
      const encryptedData = encryptData(JSON.stringify(qrData));
      
      // Prepare the URL that will be used for verification
      const qrUrl = `${window.location.origin}/check?qr=${encodeURIComponent(encryptedData)}`;
      
      // Generate the QR code image
      // Change this line to properly resolve the promise
      const dataUrlPromise = generateQRCode(qrUrl, {
        color: {
          dark: template === 'modern-blue' ? '#0c4a6e' : template === 'modern-beige' ? '#78350f' : '#000000',
          light: '#ffffff',
        }
      });
      
      qrPromises.push(
        (async () => {
          // Wait for the dataUrl promise to resolve
          const dataUrl = await dataUrlPromise;
          
          const qrCode: QRCode = {
            id: uniqueId,
            sequentialNumber: formattedSeqNumber,
            encryptedData,
            url: qrUrl,
            isScanned: false,
            isEnabled: true,
            createdAt: new Date().toISOString(),
            dataUrl,
            template,
            headerText: headerText || 'Verify Product',
            instructionText: instructionText || 'Scan QR code to verify product authenticity',
            websiteUrl: websiteUrl || window.location.origin,
            footerText: footerText || 'Thank you for choosing our product',
            directionRTL: template === 'arabic', // Arabic template is right-to-left
            arabicHeaderText: 'تحقق من المنتج',
            arabicInstructionText: 'امسح رمز QR للتحقق من صحة المنتج',
            arabicFooterText: 'شكراً لاختيارك منتجاتنا',
          };
          return qrCode;
        })()
      );
    }
    
    // Wait for all QR code generation promises to resolve
    const generatedQRCodes = await Promise.all(qrPromises);
    newQRCodes.push(...generatedQRCodes);

    // Notify the parent component about the generated QR codes
    onQRCodesGenerated(newQRCodes);
    toast.success(`${quantity} QR codes generated successfully!`);
  } catch (error: any) {
    console.error('Error generating QR codes:', error);
    setErrorMessage(`QR code generation failed: ${error.message}`);
    toast.error(`QR code generation failed: ${error.message}`);
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate QR Codes</CardTitle>
        <CardDescription>
          Create unique QR codes for product verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity !== undefined ? quantity.toString() : ''}
              onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern-blue">Modern Blue</SelectItem>
                <SelectItem value="modern-beige">Modern Beige</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Button variant="link" className="p-0" onClick={toggleAdvancedSettings}>
            {isAdvancedSettingsOpen ? (
              <>
                Hide advanced settings
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Show advanced settings
              </>
            )}
          </Button>
          
          {isAdvancedSettingsOpen && (
            <div className="mt-4 space-y-4 border rounded-md p-4 bg-secondary/50">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-text">Header Text</Label>
                  <Input
                    id="header-text"
                    placeholder="Enter header text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instruction-text">Instruction Text</Label>
                  <Textarea
                    id="instruction-text"
                    placeholder="Enter instruction text"
                    value={instructionText}
                    onChange={(e) => setInstructionText(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    type="url"
                    placeholder="Enter website URL"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="footer-text">Footer Text</Label>
                  <Input
                    id="footer-text"
                    placeholder="Enter footer text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button
          onClick={generateQRCodes}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate QR Codes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
