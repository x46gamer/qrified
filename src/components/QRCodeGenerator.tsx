import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeData, TemplateType } from '@/types/qrCode';
import QRCodeTemplates from './QRCodeTemplates';
import QRCodeTemplatePreview from './QRCodeTemplatePreview';
import { HexColorPicker } from "react-colorful";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import CryptoJS from 'crypto-js';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <HexColorPicker color={color} onChange={onChange} />
  );
};

const QRCodeGenerator: React.FC = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [foregroundColor, setForegroundColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [headerText, setHeaderText] = useState<string>('');
  const [instructionText, setInstructionText] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('');
  const [directionRTL, setDirectionRTL] = useState<boolean>(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState<boolean>(false);
  const [selectedColorType, setSelectedColorType] = useState<'foreground' | 'background' | null>(null);
  const [productId, setProductId] = useState<string>('');

  const handleColorDialogOpen = (type: 'foreground' | 'background') => {
    setSelectedColorType(type);
    setIsColorDialogOpen(true);
  };

  const handleColorChange = (color: string) => {
    if (selectedColorType === 'foreground') {
      setForegroundColor(color);
    } else if (selectedColorType === 'background') {
      setBackgroundColor(color);
    }
  };
  
  const encryptData = (text: string) => {
    console.log("Encrypting data:", text);
    const encrypted = CryptoJS.AES.encrypt(text, 'your-secret-key').toString();
    console.log("Encrypted data:", encrypted);
    return encrypted;
  };

  const generateQRCode = async () => {
    try {
      // Allow empty productId (optional)
      const dataToEncrypt = productId ? productId : uuidv4();
      
      const encryptedData = encryptData(dataToEncrypt);
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/check?data=${encryptedData}`;

      const qrCodeOptions = {
        errorCorrectionLevel: 'H',
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      };

      QRCode.toDataURL(url, qrCodeOptions, (err, qrCodeDataUrl) => {
        if (err) {
          console.error("Error generating QR code:", err);
          toast.error("Failed to generate QR code");
          return;
        }
        setQrCodeDataUrl(qrCodeDataUrl);
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product Identifier (Optional)</Label>
              <Input
                id="productId"
                placeholder="Enter product ID or leave blank for auto-generated ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <QRCodeTemplates template={template} setTemplate={setTemplate} />
            </div>
            
            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="flex gap-3">
                <Button onClick={() => handleColorDialogOpen('foreground')}>
                  Foreground: {foregroundColor}
                </Button>
                <Button onClick={() => handleColorDialogOpen('background')}>
                  Background: {backgroundColor}
                </Button>
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
              <Input
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
              <Label htmlFor="directionRTL">Right-to-Left Direction</Label>
              <Input
                id="directionRTL"
                type="checkbox"
                checked={directionRTL}
                onChange={(e) => setDirectionRTL(e.target.checked)}
              />
            </div>
            
            <Button onClick={generateQRCode}>Generate QR Code</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          <QRCodeTemplatePreview
            template={template}
            qrCodeDataUrl={qrCodeDataUrl}
            headerText={headerText}
            instructionText={instructionText}
            websiteUrl={websiteUrl}
            footerText={footerText}
            directionRTL={directionRTL}
          />
        </CardContent>
      </Card>

      {/* Color Picker Dialog */}
      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pick a color</DialogTitle>
            <DialogDescription>
              Choose a color for the {selectedColorType === 'foreground' ? 'foreground' : 'background'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <ColorPicker
                color={selectedColorType === 'foreground' ? foregroundColor : backgroundColor}
                onChange={handleColorChange}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeGenerator;
