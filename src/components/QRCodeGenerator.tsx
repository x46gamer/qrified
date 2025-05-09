
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import QRCodeTemplates from './QRCodeTemplates';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { QRCode, QRCodeData, TemplateType } from '@/types/qrCode';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { generateQRCodeData } from '@/utils/qrCodeUtils';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface GeneratorProps {
  onQRCodesGenerated?: (newQRCodes: QRCode[]) => Promise<void>;
  lastSequentialNumber?: number;
}

export const QRCodeGenerator = ({ onQRCodesGenerated, lastSequentialNumber = 0 }: GeneratorProps) => {
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [productName, setProductName] = useState<string>('');
  const [productIdentifier, setProductIdentifier] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [sequential, setSequential] = useState<boolean>(false);
  const [startingNumber, setStartingNumber] = useState<number>(lastSequentialNumber + 1);
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<QRCodeData[]>([]);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartingNumber(lastSequentialNumber + 1);
  }, [lastSequentialNumber]);

  useEffect(() => {
    if (generatedQRCodes.length > 0 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }, [generatedQRCodes]);

  const generateQRCodes = async () => {
    if (!productIdentifier && !productName) {
      toast.error('Product identifier or name is required');
      return;
    }

    setGenerateLoading(true);
    const codes: QRCodeData[] = [];

    try {
      for (let i = 0; i < quantity; i++) {
        let uniqueId;
        if (sequential) {
          uniqueId = (startingNumber + i).toString().padStart(6, '0');
        } else {
          uniqueId = uuidv4().split('-')[0];
        }

        const codeData = generateQRCodeData({
          productName,
          productId: productIdentifier || uniqueId,
          description,
          template,
          uniqueId
        });

        codes.push(codeData);
      }

      setGeneratedQRCodes(codes);

      if (onQRCodesGenerated && user) {
        // Convert to QRCode format for saving to the database
        const qrCodes = codes.map(code => ({
          id: uuidv4(),
          userId: user.id,
          data: code,
          createdAt: new Date().toISOString(),
          scans: 0
        }));

        await onQRCodesGenerated(qrCodes);
      }
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setGenerateLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Tabs defaultValue="generate">
            <TabsList className="w-full justify-start rounded-none border-b bg-muted/50">
              <TabsTrigger value="generate" className="rounded-none">Generate</TabsTrigger>
              <TabsTrigger value="templates" className="rounded-none">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="generate" className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name (Optional)</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="productId">Product Identifier (Optional)</Label>
                    <Input
                      id="productId"
                      value={productIdentifier}
                      onChange={(e) => setProductIdentifier(e.target.value)}
                      placeholder="Enter product ID or SKU"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex space-x-2 items-center mt-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                          -
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max="100"
                          className="w-20 text-center"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={quantity >= 100}
                          onClick={() => setQuantity(q => Math.min(100, q + 1))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="sequential" 
                          checked={sequential}
                          onCheckedChange={setSequential}
                        />
                        <Label htmlFor="sequential">Sequential</Label>
                      </div>
                      
                      {sequential && (
                        <Input
                          type="number"
                          min="1"
                          className="w-24"
                          value={startingNumber}
                          onChange={(e) => setStartingNumber(parseInt(e.target.value) || lastSequentialNumber + 1)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
                  <QRCodeDisplay
                    data={generateQRCodeData({
                      productName: productName || 'Sample Product',
                      productId: productIdentifier || '123456',
                      description: description || 'Sample description of the product',
                      template,
                      uniqueId: '123456'
                    })}
                    showDownload={false}
                    className="w-48 h-48"
                  />
                  <p className="mt-4 text-sm text-muted-foreground">Template: {template}</p>
                </div>
              </div>
              
              {/* Template Selection */}
              <div>
                <Label htmlFor="template">Template</Label>
                <QRCodeTemplates selectedTemplate={template} onSelectTemplate={setTemplate} />
              </div>
              
              <Button 
                onClick={generateQRCodes} 
                disabled={generateLoading}
                className="w-full"
              >
                {generateLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> 
                    Generating...
                  </>
                ) : (
                  'Generate QR Code'
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="templates" className="p-6">
              <QRCodeTemplates selectedTemplate={template} onSelectTemplate={setTemplate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Generated QR Codes */}
      {generatedQRCodes.length > 0 && (
        <div ref={scrollRef}>
          <h3 className="text-lg font-medium mb-4">Generated QR Codes ({generatedQRCodes.length})</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generatedQRCodes.map((code, index) => (
              <QRCodeDisplay 
                key={index}
                data={code}
                showDownload={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
