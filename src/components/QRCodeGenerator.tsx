
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeTemplatePreview from './QRCodeTemplatePreview';
import { ShieldCheck, Loader2, QrCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateQRCodeImage, encryptData } from '@/utils/qrCodeUtils';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { TemplateType } from '@/types/qrCode';

interface QRCodeGeneratorProps {
  onQRCodesGenerated: (qrCodes: any[]) => void;
  lastSequentialNumber: number;
}

interface FormValues {
  quantity: number;
  productData: string;
  template: TemplateType;
  baseUrl: string;
  headerText: string;
  instructionText: string;
  footerText: string;
  websiteUrl: string;
  isRTL: boolean;
}

const DEFAULT_VALUES: FormValues = {
  quantity: 1,
  productData: "Original Authentic Product",
  template: "classic",
  baseUrl: window.location.origin,
  headerText: "Product Authentication",
  instructionText: "Scan this QR code to verify the authenticity of your product",
  footerText: "Thank you for choosing our product",
  websiteUrl: "",
  isRTL: false
};

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  onQRCodesGenerated,
  lastSequentialNumber
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES
  });
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6'); // blue-500
  const [secondaryColor, setPrimaryColorDark] = useState<string>('#8b5cf6'); // purple-500
  
  const template = watch('template');
  const quantity = watch('quantity');
  const baseUrl = watch('baseUrl');

  // Set the base URL on component mount
  useEffect(() => {
    setValue('baseUrl', window.location.origin);
  }, [setValue]);
  
  const onSubmit = async (data: FormValues) => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // Create an array of QR codes based on quantity
      const qrCodes = [];
      const startingSeqNumber = lastSequentialNumber + 1;
      
      for (let i = 0; i < data.quantity; i++) {
        const id = uuidv4();
        const sequentialNumber = startingSeqNumber + i;
        const url = `${data.baseUrl}/check?id=${id}`;
        
        // Encrypt product data
        const encryptedData = await encryptData(data.productData);
        
        // Generate QR Code
        const dataUrl = await generateQRCodeImage(url, {
          template: data.template,
          primaryColor,
          secondaryColor,
          size: 300,
        });
        
        qrCodes.push({
          id,
          sequential_number: String(sequentialNumber),
          encrypted_data: encryptedData,
          url,
          is_scanned: false,
          is_enabled: true,
          data_url: dataUrl,
          template: data.template,
          header_text: data.headerText,
          instruction_text: data.instructionText,
          website_url: data.websiteUrl || null,
          footer_text: data.footerText,
          direction_rtl: data.isRTL
        });
      }
      
      // Save to database
      try {
        // Insert into database
        const { error } = await supabase
          .from('qr_codes')
          .insert(qrCodes);

        if (error) {
          console.error('Error saving QR codes:', error);
          toast.error('Failed to save QR codes to database');
          return;
        }

        // Update sequence counter
        const newCount = startingSeqNumber + data.quantity - 1;
        await supabase.rpc('increment_counter', {
          counter_id: 'qr_code_sequential',
          new_value: newCount
        });
        
        toast.success(`Successfully generated ${data.quantity} QR code(s)`);
        onQRCodesGenerated(qrCodes);
        
      } catch (err) {
        console.error('Error in QR code generation process:', err);
        toast.error('An error occurred while generating QR codes');
      }
      
    } catch (err) {
      console.error('Error generating QR codes:', err);
      toast.error('Failed to generate QR codes');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    setValue('quantity', value[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity (1-100)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider 
                      min={1}
                      max={100}
                      step={1}
                      defaultValue={[1]}
                      onValueChange={handleSliderChange}
                      className="flex-1"
                    />
                    <Input
                      {...register('quantity', {
                        required: "Quantity is required",
                        min: {
                          value: 1,
                          message: "Quantity must be at least 1"
                        },
                        max: {
                          value: 100,
                          message: "Quantity must not exceed 100"
                        }
                      })}
                      type="number"
                      id="quantity"
                      min={1}
                      max={100}
                      className="w-20"
                      onChange={(e) => setValue('quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  {errors.quantity && (
                    <span className="text-sm text-red-500">{errors.quantity.message}</span>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="productData">Product Data</Label>
                  <Input
                    {...register('productData', {
                      required: "Product data is required"
                    })}
                    id="productData"
                    placeholder="Enter product details to encrypt"
                    className="mt-1"
                  />
                  {errors.productData && (
                    <span className="text-sm text-red-500">{errors.productData.message}</span>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    This data will be encrypted and embedded in the QR code
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    {...register('baseUrl', {
                      required: "Base URL is required"
                    })}
                    id="baseUrl"
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                  <Input
                    {...register('websiteUrl')}
                    id="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    If provided, a button to visit this website will be displayed on verification page
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <input
                      type="color"
                      id="primaryColor"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <input
                      type="color"
                      id="secondaryColor"
                      value={secondaryColor}
                      onChange={(e) => setPrimaryColorDark(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Verification Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="headerText">Header Text</Label>
                  <Input
                    {...register('headerText')}
                    id="headerText"
                    placeholder="Product Authentication"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instructionText">Instruction Text</Label>
                  <Input
                    {...register('instructionText')}
                    id="instructionText"
                    placeholder="Scan this QR code to verify the authenticity of your product"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    {...register('footerText')}
                    id="footerText"
                    placeholder="Thank you for choosing our product"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRTL"
                    {...register('isRTL')}
                    className="rounded"
                  />
                  <Label htmlFor="isRTL">Right to Left Text Direction</Label>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>QR Code Template</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <Tabs defaultValue="classic" className="w-full" onValueChange={(value) => setValue('template', value as TemplateType)}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="classic">Classic</TabsTrigger>
                    <TabsTrigger value="modern-blue">Modern Blue</TabsTrigger>
                    <TabsTrigger value="modern-beige">Modern Beige</TabsTrigger>
                    <TabsTrigger value="arabic">Arabic</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="w-64 h-64">
                      <QRCodeTemplatePreview
                        template={template}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        size={256}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-muted-foreground">
                      {template === 'classic' && "Simple and clean design with solid colors"}
                      {template === 'modern-blue' && "Modern design with blue gradient"}
                      {template === 'modern-beige' && "Elegant design with beige gradient"}
                      {template === 'arabic' && "Optimized for right-to-left languages"}
                    </p>
                  </div>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" /> Generate QR Code{quantity > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
                
                <div className="mt-4 text-center flex items-center justify-center text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
                  Your data is encrypted securely
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QRCodeGenerator;
