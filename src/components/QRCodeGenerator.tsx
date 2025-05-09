import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { QRCodeSVG } from 'qrcode.react';
import { QRCode } from '@/types/qrCode';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { AppearanceSettingsContext } from './AppearanceSettings';
import { TemplateType, QRCodeTemplates } from './QRCodeTemplates';
// Import the type guard function we created
import { isTemplateType } from '@/utils/typeGuards';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodesGenerated, lastSequentialNumber }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [headerText, setHeaderText] = useState<string>('');
  const [instructionText, setInstructionText] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('');
  const [directionRTL, setDirectionRTL] = useState<boolean>(false);
  const [qrCodesPreview, setQrCodesPreview] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const { primaryColor, secondaryColor } = React.useContext(AppearanceSettingsContext);
  
  const generateQRCodes = async () => {
    setIsGenerating(true);
    try {
      const newQRCodes: QRCode[] = [];
      const qrCodeDataUrls: string[] = [];
      
      for (let i = 0; i < quantity; i++) {
        const sequentialNumber = lastSequentialNumber + i + 1;
        const encryptedData = `product-${sequentialNumber}`;
        const qrCodeData = `${websiteUrl}?id=${encryptedData}`;
        
        // Generate QR code as SVG
        const svg = (
          <QRCodeSVG 
            value={qrCodeData}
            size={256}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        ).props.value;
        
        qrCodeDataUrls.push(svg);
        
        newQRCodes.push({
          id: uuidv4(),
          sequentialNumber: sequentialNumber,
          encryptedData: encryptedData,
          url: qrCodeData,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
          scannedAt: null,
          dataUrl: svg,
          template: template,
          headerText: headerText,
          instructionText: instructionText,
          websiteUrl: websiteUrl,
          footerText: footerText,
          directionRTL: directionRTL,
        });
      }
      
      setQrCodesPreview(qrCodeDataUrls);
      
      // Save QR codes to Supabase
      await saveQRCodesToSupabase(newQRCodes);
      
      toast.success(`${quantity} QR codes generated successfully!`);
      onQRCodesGenerated(newQRCodes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const saveQRCodesToSupabase = async (qrCodes: QRCode[]) => {
    try {
      // Prepare data for Supabase insert
      const qrCodesToInsert = qrCodes.map(qrCode => ({
        id: qrCode.id,
        sequential_number: qrCode.sequentialNumber,
        encrypted_data: qrCode.encryptedData,
        url: qrCode.url,
        is_scanned: qrCode.isScanned,
        is_enabled: qrCode.isEnabled,
        created_at: qrCode.createdAt,
        scanned_at: qrCode.scannedAt,
        data_url: qrCode.dataUrl,
        template: qrCode.template,
        header_text: qrCode.headerText,
        instruction_text: qrCode.instructionText,
        website_url: qrCode.websiteUrl,
        footer_text: qrCode.footerText,
        direction_rtl: qrCode.directionRTL,
      }));
      
      // Insert QR codes into Supabase
      const { error } = await supabase
        .from('qr_codes')
        .insert(qrCodesToInsert);
      
      if (error) {
        console.error('Error saving QR codes to Supabase:', error);
        toast.error('Failed to save QR codes to database');
        return;
      }
      
      // Update the sequence counter
      await updateSequenceCounter(quantity);
    } catch (error) {
      console.error('Error saving QR codes:', error);
      toast.error('An error occurred while saving QR codes');
    }
  };
  
  const updateSequenceCounter = async (increment: number) => {
    try {
      // Increment the counter value
      const { error } = await supabase.rpc('increment_qr_code_counter', { increment_value: increment });
      
      if (error) {
        console.error('Error incrementing counter:', error);
        toast.error('Failed to update sequence counter');
      }
    } catch (error) {
      console.error('Error updating sequence counter:', error);
    }
  };
  
  const renderTemplatePreview = () => {
    const qrCodeData = `${websiteUrl}?id=preview-code`;
    
    let TemplateComponent = QRCodeTemplates[template];
    
    if (!TemplateComponent) {
      TemplateComponent = QRCodeTemplates['classic'];
    }
    
    return (
      <div className="border rounded-lg p-4 bg-white/50 shadow-sm">
        <h4 className="font-medium mb-4">Template Preview</h4>
        <div className="relative">
          <TemplateComponent
            qrCodeValue={qrCodeData}
            headerText={headerText}
            instructionText={instructionText}
            websiteUrl={websiteUrl}
            footerText={footerText}
            directionRTL={directionRTL}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate QR Codes</CardTitle>
        <CardDescription>Customize and generate QR codes for your products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              type="number" 
              id="quantity" 
              min="1" 
              max="100" 
              defaultValue="1"
              onChange={(e) => setQuantity(parseInt(e.target.value))} 
            />
          </div>
          
          <div>
            <Label htmlFor="template">Template</Label>
            <Select onValueChange={(value) => {
              if (isTemplateType(value)) {
                setTemplate(value);
              } else {
                console.error(`Invalid template type: ${value}`);
              }
            }}>
              <SelectTrigger className="w-full">
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
        
        <div className="space-y-2">
          <Label htmlFor="headerText">Header Text</Label>
          <Input
            id="headerText"
            placeholder="Enter header text"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructionText">Instruction Text</Label>
          <Textarea
            id="instructionText"
            placeholder="Enter instruction text"
            value={instructionText}
            onChange={(e) => setInstructionText(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            placeholder="Enter website URL"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footerText">Footer Text</Label>
          <Input
            id="footerText"
            placeholder="Enter footer text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            id="directionRTL"
            checked={directionRTL}
            onChange={(e) => setDirectionRTL(e.target.checked)}
          />
          <Label htmlFor="directionRTL">Right-to-Left Direction (Arabic)</Label>
        </div>
        
        {renderTemplatePreview()}
        
        <Button onClick={generateQRCodes} disabled={isGenerating} className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
          {isGenerating ? "Generating..." : "Generate QR Codes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
