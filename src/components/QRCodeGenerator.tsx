import React, { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeData, QRCode, TemplateType } from '@/types/qrCode';
import QRCodeTemplates from './QRCodeTemplates';
import QRCodeTemplatePreview from './QRCodeTemplatePreview';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: QRCode[]) => void;
  lastSequentialNumber: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodesGenerated, lastSequentialNumber }) => {
  const [text, setText] = useState('');
  const [numberOfCodes, setNumberOfCodes] = useState(1);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<QRCode[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic');
  const [headerText, setHeaderText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [footerText, setFooterText] = useState('');
  const [directionRTL, setDirectionRTL] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateQRCode = useCallback(async (data: string): Promise<string> => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        width: 256,
        margin: 1,
        color: {
          dark: '#000',
          light: '#fff',
        },
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      toast.error("Failed to generate QR code.");
      return '';
    }
  }, []);
  
  const validateQRCodeData = (data: QRCodeData): boolean => {
    // Removed product name validation since it's now optional
    return true;
  };

  const handleGenerateQRCodes = async () => {
    if (numberOfCodes <= 0) {
      toast.error('Number of codes must be greater than 0.');
      return;
    }
    
    setIsGenerating(true);
    
    const newQRCodes: QRCode[] = [];
    
    for (let i = 0; i < numberOfCodes; i++) {
      const sequentialNumber = lastSequentialNumber + i + 1;
      const qrCodeData: QRCodeData = {
        text: `${text}-${sequentialNumber}`,
        template: selectedTemplate,
      };
      
      const isValidData = Boolean(selectedTemplate);
      
      if (!isValidData) {
        toast.error('Please select a QR code template.');
        setIsGenerating(false);
        return;
      }
      
      try {
        // Encrypt the data
        const encryptedData = btoa(JSON.stringify(qrCodeData));
        
        // Generate a unique ID for the QR code
        const id = uuidv4();
        
        // Construct the URL
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/check?id=${id}`;
        
        // Generate the QR code
        const dataUrl = await generateQRCode(url);
        
        // Create the QR code object
        const newQRCode: QRCode = {
          id: id,
          sequentialNumber: sequentialNumber.toString(),
          encryptedData: encryptedData,
          url: url,
          isScanned: false,
          isEnabled: true,
          createdAt: new Date().toISOString(),
          dataUrl: dataUrl,
          template: selectedTemplate,
          headerText: headerText,
          instructionText: instructionText,
          websiteUrl: websiteUrl,
          footerText: footerText,
          directionRTL: directionRTL,
        };
        
        // Add the QR code to the array
        newQRCodes.push(newQRCode);
      } catch (error) {
        console.error("QR code generation failed:", error);
        toast.error("QR code generation failed. Please try again.");
        setIsGenerating(false);
        return;
      }
    }
    
    try {
      // Insert the new QR codes into the database
      const { data, error } = await supabase
        .from('qr_codes')
        .insert(newQRCodes.map(qrCode => ({
          id: qrCode.id,
          sequential_number: qrCode.sequentialNumber,
          encrypted_data: qrCode.encryptedData,
          url: qrCode.url,
          is_scanned: qrCode.isScanned,
          is_enabled: qrCode.isEnabled,
          created_at: qrCode.createdAt,
          data_url: qrCode.dataUrl,
          template: qrCode.template,
          header_text: qrCode.headerText,
          instruction_text: qrCode.instructionText,
          website_url: qrCode.websiteUrl,
          footer_text: qrCode.footerText,
          direction_rtl: qrCode.directionRTL,
        })));
      
      if (error) {
        console.error('Error inserting QR codes:', error);
        toast.error('Failed to save QR codes to database');
        setIsGenerating(false);
        return;
      }
      
      // Update the sequence counter
      const { error: counterError } = await supabase
        .from('sequence_counters')
        .update({ current_value: lastSequentialNumber + numberOfCodes })
        .eq('id', 'qr_code_sequential');
      
      if (counterError) {
        console.error('Error updating counter:', counterError);
      }
      
      // Update state and notify parent component
      setGeneratedQRCodes(newQRCodes);
      onQRCodesGenerated(newQRCodes);
      toast.success(`${numberOfCodes} QR codes generated successfully!`);
    } catch (dbError) {
      console.error("Database insertion failed:", dbError);
      toast.error("Failed to save QR codes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input and Configuration Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="text">Product Name</Label>
          <Input
            id="text"
            type="text"
            placeholder="Enter product name"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="numberOfCodes">Number of Codes</Label>
          <Input
            id="numberOfCodes"
            type="number"
            placeholder="Enter number of codes to generate"
            value={numberOfCodes.toString()}
            onChange={(e) => setNumberOfCodes(parseInt(e.target.value, 10))}
          />
        </div>
        
        <QRCodeTemplates 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
        
        {selectedTemplate !== 'classic' && (
          <>
            <div>
              <Label htmlFor="headerText">Header Text</Label>
              <Input
                id="headerText"
                type="text"
                placeholder="Enter header text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="instructionText">Instruction Text</Label>
              <Input
                id="instructionText"
                type="text"
                placeholder="Enter instruction text"
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="Enter website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                type="text"
                placeholder="Enter footer text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
              />
            </div>
            
            {selectedTemplate === 'arabic' && (
              <div>
                <Label htmlFor="directionRTL">Right-to-Left Direction</Label>
                <Input
                  id="directionRTL"
                  type="checkbox"
                  checked={directionRTL}
                  onChange={(e) => setDirectionRTL(e.target.checked)}
                />
              </div>
            )}
          </>
        )}
        
        <Button 
          onClick={handleGenerateQRCodes}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate QR Codes'}
        </Button>
      </div>
      
      {/* Template Preview Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Template Preview</h3>
        <QRCodeTemplatePreview
          template={selectedTemplate}
          qrCodeDataUrl={generatedQRCodes.length > 0 ? generatedQRCodes[0].dataUrl || '' : ''}
          headerText={headerText}
          instructionText={instructionText}
          websiteUrl={websiteUrl}
          footerText={footerText}
          directionRTL={directionRTL}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
