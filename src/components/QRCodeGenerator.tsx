import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { generateQRCode } from '@/utils/qrCodeUtils';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppearanceSettings } from '@/contexts/AppearanceContext';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [footerText, setFooterText] = useState('');
  const [directionRTL, setDirectionRTL] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState("standard");
  const { primaryColor, secondaryColor } = useAppearanceSettings();

  const templateOptions = [
    { value: "standard", label: "Standard" },
    { value: "branded", label: "Branded" },
    { value: "minimalist", label: "Minimalist" }
  ];

  useEffect(() => {
    if (url) {
      handleGenerateQRCode();
    }
  }, [primaryColor, secondaryColor]);

  const handleGenerateQRCode = async () => {
    setIsLoading(true);
    try {
      const dataToEncode = JSON.stringify({
        url,
        headerText,
        instructionText,
        websiteUrl,
        footerText,
        directionRTL,
        template,
        primaryColor,
        secondaryColor
      });

      const qrCodeDataUrl = await generateQRCode(dataToEncode);
      setQrCodeDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
        <CardDescription>
          Customize your QR code with additional information and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="url">URL to Encode</Label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="headerText">Header Text</Label>
          <Input
            id="headerText"
            placeholder="Scan for more info"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructionText">Instruction Text</Label>
          <Textarea
            id="instructionText"
            placeholder="Point your camera at the QR code"
            value={instructionText}
            onChange={(e) => setInstructionText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            placeholder="https://yourwebsite.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footerText">Footer Text</Label>
          <Input
            id="footerText"
            placeholder="Powered by Your Brand"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="directionRTL">Right-to-Left Direction</Label>
          <Switch
            id="directionRTL"
            checked={directionRTL}
            onCheckedChange={(checked) => setDirectionRTL(checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerateQRCode} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate QR Code"}
        </Button>

        {qrCodeDataUrl && (
          <div className="mt-4">
            <img src={qrCodeDataUrl} alt="Generated QR Code" className="mx-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
