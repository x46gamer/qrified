import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeTemplatePreview } from './QRCodeTemplatePreview';
import { ShieldCheck, Loader2, QrCode, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateQRCodeImage, encryptData } from '@/utils/qrCodeUtils';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { TemplateType } from '@/types/qrCode';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserLimits } from "@/types/userLimits";

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
  productData: "Your Product Name",
  template: "classic",
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '', // Handle SSR
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
  const [primaryColor, setPrimaryColor] = useState<string>('#000000');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ffffff');
  const [previewQRCode, setPreviewQRCode] = useState<string | null>(null);
  const [verifiedDomains, setVerifiedDomains] = useState<Array<{ id: string; domain: string }>>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [monthlyQrLimit, setMonthlyQrLimit] = useState<number>(0);
  const [monthlyQrCreated, setMonthlyQrCreated] = useState<number>(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const template = watch('template');
  const quantity = watch('quantity');
  const baseUrl = watch('baseUrl');

  // Fetch user limits on component mount
  useEffect(() => {
    const fetchUserLimits = async () => {
      if (!user) return;
      
      try {
        const { data: fetchedLimitData, error: userLimitError } = await supabase
          .from('user_limits')
          .select('monthly_qr_limit, monthly_qr_created, last_monthly_reset')
          .eq('id', user.id)
          .single();

        if (userLimitError) {
          console.error('Error fetching user limits:', userLimitError.message);
          return;
        }

        if (fetchedLimitData) {
          const now = new Date();
          const lastReset = new Date((fetchedLimitData as any).last_monthly_reset);
          
          // Check if a month has passed since the last reset
          if (now.getFullYear() > lastReset.getFullYear() || 
              (now.getFullYear() === lastReset.getFullYear() && now.getMonth() > lastReset.getMonth())) {
            // Reset monthly count if a new month has started
            setMonthlyQrCreated(0);
          } else {
            setMonthlyQrCreated((fetchedLimitData as any).monthly_qr_created);
          }
          
          setMonthlyQrLimit((fetchedLimitData as any).monthly_qr_limit);
        }
      } catch (error) {
        console.error('Error in fetchUserLimits:', error);
      }
    };

    fetchUserLimits();
  }, [user]);

  // Fetch verified domains
  useEffect(() => {
    const fetchVerifiedDomains = async () => {
      if (!user) return;
      
      setIsLoadingDomains(true);
      try {
        const { data, error } = await supabase
          .from('custom_domains')
          .select('id, domain')
          .eq('status', 'verified')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching domains:', error);
          return;
        }

        setVerifiedDomains(data || []);
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setIsLoadingDomains(false);
      }
    };

    fetchVerifiedDomains();
  }, [user]);

  // Set the base URL on component mount if window is defined
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue('baseUrl', window.location.origin);
    }
  }, [setValue]);
  
  // Generate a preview QR code whenever template or colors change
  useEffect(() => {
    const generatePreview = async () => {
      if (typeof window === 'undefined') return; // Don't run on server
      try {
        const previewUrl = `${window.location.origin}/check?id=preview`;
        const dataUrl = await generateQRCodeImage(previewUrl, {
          template,
          primaryColor,
          secondaryColor,
          size: 256 // This is the internal QR image size, container will style it
        });
        setPreviewQRCode(dataUrl);
      } catch (error) {
        console.error('Error generating preview QR code:', error);
      }
    };
    
    generatePreview();
  }, [template, primaryColor, secondaryColor]);
  
  const onSubmit = async (data: FormValues) => {
    if (isGenerating) return;
    
    if (!user) {
      toast.error('You must be logged in to generate QR codes');
      return;
    }
    
    try {
      setIsGenerating(true);
      console.log('Generating QR codes with data:', data);
      console.log('Current user:', user);
      
      if (!data.productData || data.productData.trim() === '') {
        toast.error('Please enter valid product data');
        setIsGenerating(false);
        return;
      }
      
      // --- Monthly Limit Check and Reset ---
      console.log('Fetching user limits for user:', user.id);
      const { data: fetchedLimitData, error: userLimitError } = await supabase
        .from('user_limits')
        .select('monthly_qr_limit, monthly_qr_created, last_monthly_reset, qr_created')
        .eq('id', user.id)
        .single();

      let monthly_qr_limit = 0; 
      let monthly_qr_created = 0; 
      let last_monthly_reset = new Date(0).toISOString(); 
      let allTimeQrCreated = 0; 

      if (userLimitError) {
          console.error('Error fetching user limits:', userLimitError.message);
      } else if (fetchedLimitData) { 
          monthly_qr_limit = (fetchedLimitData as any).monthly_qr_limit;
          monthly_qr_created = (fetchedLimitData as any).monthly_qr_created;
          last_monthly_reset = (fetchedLimitData as any).last_monthly_reset;
          allTimeQrCreated = (fetchedLimitData as any).qr_created;
      } else {
          console.log('No user limits entry found for user:', user.id);
      }

      const now = new Date();
      const lastReset = new Date(last_monthly_reset || new Date(0).toISOString());

      let resetNeeded = false;
      if (now.getFullYear() > lastReset.getFullYear() || (now.getFullYear() === lastReset.getFullYear() && now.getMonth() > lastReset.getMonth())) {
        console.log('Resetting monthly QR count for user:', user.id);
        monthly_qr_created = 0; 
        last_monthly_reset = now.toISOString(); 
        resetNeeded = true;
      }

      const currentMonthlyCreated = typeof monthly_qr_created === 'number' ? monthly_qr_created : 0;
      const monthlyLimit = typeof monthly_qr_limit === 'number' ? monthly_qr_limit : 0;

      if (currentMonthlyCreated + data.quantity > monthlyLimit) {
        toast.error(`You have reached your monthly limit of ${monthlyLimit} QR codes.`);
        setIsGenerating(false);
        return;
      }
      // --- End Monthly Limit Check and Reset ---
      
      const qrCodes = [];
      const { data: counterData, error: counterError } = await supabase
      .from('sequence_counters')
      .select('current_value')
      .eq('id', 'qr_code_sequential')
      .single();
    
      if (counterError) {
        toast.error('Failed to fetch sequence counter');
        setIsGenerating(false);
        return;
      }
    
      const startingSeqNumber = (counterData?.current_value || 0) + 1;       
      for (let i = 0; i < data.quantity; i++) {
        const id = uuidv4();
        const sequentialNumber = startingSeqNumber + i;
        const url = `${data.baseUrl}/check?id=${id}`;
        
        console.log('Encrypting product data:', data.productData);
        const encryptedData = await encryptData(data.productData);
        console.log('Encrypted result:', encryptedData, 'length:', encryptedData.length);
        
        if (!encryptedData || encryptedData.length < 10) {
          throw new Error('Encryption failed or produced invalid output');
        }
        
        const dataUrl = await generateQRCodeImage(url, {
          template: data.template,
          primaryColor,
          secondaryColor,
          size: 300,
        });
        
        if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
          throw new Error('QR code generation failed or produced invalid data URL');
        }
        
        console.log('Generated QR code data URL length:', dataUrl.length);
        
        qrCodes.push({
          id,
          sequential_number: String(sequentialNumber),
          encrypted_data: encryptedData,
          url,
          is_scanned: false,
          is_enabled: true,
          data_url: dataUrl,
          template: data.template,
          header_text: data.headerText || 'Product Authentication',
          instruction_text: data.instructionText || 'Scan this QR code to verify the authenticity of your product',
          website_url: data.websiteUrl || null,
          footer_text: data.footerText || 'Thank you for choosing our product',
          direction_rtl: data.isRTL,
          user_id: user.id 
        });
      }
      
      try {
        console.log('Saving QR codes to database:', qrCodes.length, 'codes');
        console.log('QR codes user_id:', qrCodes[0]?.user_id);
        
        const { error } = await supabase
          .from('qr_codes')
          .insert(qrCodes);

        if (error) {
          console.error('Error saving QR codes:', error);
          toast.error(`Failed to save QR codes to database: ${error.message}`);
          return;
        }

        const updatePayload: Partial<UserLimits> = { 
          monthly_qr_created: monthly_qr_created + data.quantity, 
          qr_created: allTimeQrCreated + data.quantity, 
        };

        if (resetNeeded) {
          updatePayload.last_monthly_reset = last_monthly_reset; 
        }

        console.log('Updating user limits for user:', user.id, 'with payload:', updatePayload);
        const { error: updateLimitError } = await supabase
          .from('user_limits')
          .update(updatePayload)
          .eq('id', user.id);

        if (updateLimitError) {
          console.error('Error updating user limits:', updateLimitError.message);
          toast.warning('QR codes created but user limits failed to update.');
        } else {
          setMonthlyQrCreated(prev => prev + data.quantity);
        }

        const { data: updatedCounterData, error: updateCounterError } = await supabase.rpc('increment_counter', {
          counter_id: 'qr_code_sequential',
          increment_by: data.quantity
        });
        
        if (updateCounterError) {
          console.error('Error updating counter:', updateCounterError);
          toast.warning('QR codes created but counter update failed');
        } else {
          console.log('Updated counter to:', updatedCounterData);
        }
        
        const mappedQrCodes = qrCodes.map(qr => ({
          id: qr.id,
          sequentialNumber: qr.sequential_number,
          dataUrl: qr.data_url,
          template: qr.template,
          headerText: qr.header_text,
          instructionText: qr.instruction_text,
          websiteUrl: qr.website_url,
          footerText: qr.footer_text,
          directionRTL: qr.direction_rtl,
          userId: qr.user_id
        }));
        
        toast.success(`Successfully generated ${data.quantity} QR code(s)`);
        onQRCodesGenerated(mappedQrCodes);
        
      } catch (err) {
        console.error('Error in QR code generation process:', err);
        toast.error('An error occurred while generating QR codes');
      }
      
    } catch (err) {
      console.error('Error generating QR codes:', err);
      toast.error(`Failed to generate QR codes: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    setValue('quantity', value[0]);
  };

  const handleDomainSelect = (domain: string) => {
    setValue('websiteUrl', `https://${domain}`);
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
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <div className="min-h-[100px]">
                    {isLoadingDomains ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading domains...</span>
                      </div>
                    ) : verifiedDomains.length > 0 ? (
                      <div className="space-y-2">
                        <Select onValueChange={handleDomainSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {verifiedDomains.map((domain) => (
                              <SelectItem key={domain.id} value={domain.domain}>
                                {domain.domain}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          No verified domains found. Add and verify a domain to use it in your QR codes.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/domains')}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Add Domain
                        </Button>
                      </div>
                    )}
                  </div>
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
                      className="w-10 h-10 rounded cursor-pointer border" // Added border for better visibility
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <input
                      type="color"
                      id="secondaryColor"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border" // Added border for better visibility
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
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setValue('headerText', 'Product Authentication');
                      setValue('instructionText', 'Scan this QR code to verify the authenticity of your product');
                      setValue('footerText', 'Thank you for choosing our product');
                      setValue('isRTL', false);
                    }}
                  >
                    EN
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setValue('headerText', 'توثيق المنتج');
                      setValue('instructionText', 'امسح رمز الاستجابة السريعة هذا للتحقق من أصلية منتجك');
                      setValue('footerText', 'شكرًا لاختيارك منتجنا');
                      setValue('isRTL', true);
                    }}
                  >
                    AR
                  </Button>
                </div>
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
                    className="rounded h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" // Enhanced styling
                  />
                  <Label htmlFor="isRTL">Right to Left Text Direction</Label>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full flex flex-col sticky top-6"> {/* Added sticky positioning */}
              <CardHeader>
                <CardTitle>QR Code Template & Preview</CardTitle> {/* Updated title */}
              </CardHeader>
              <CardContent className="flex-1">
                <Tabs defaultValue="classic" className="w-full" onValueChange={(value) => setValue('template', value as TemplateType)}>
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4"> {/* Adjusted grid for responsiveness */}
                    <TabsTrigger value="classic">Original</TabsTrigger> {/* Simplified names */}
                    <TabsTrigger value="classic1">Classic 1</TabsTrigger>
                    <TabsTrigger value="classic2">Classic 2</TabsTrigger>
                    <TabsTrigger value="classic3">Classic 3</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 flex justify-center items-center"> {/* Added items-center */}
                    {/* Changed dimensions here */}
                    <div className="w-[250px] h-[400px] border rounded-md p-2 flex justify-center items-center bg-gray-50">
                      <QRCodeTemplatePreview
                        template={template}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        size={230} // Adjusted size to fit well within 250px width with padding
                        qrCodeDataUrl={previewQRCode || undefined}
                        // Passing text props for live preview within the template itself
                        headerText={watch('headerText')}
                        instructionText={watch('instructionText')}
                        websiteUrl={watch('websiteUrl')}
                        footerText={watch('footerText')}
                        directionRTL={watch('isRTL')}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Live preview of the selected QR code template.
                    </p>
                  </div>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white" // Added text-white
                  disabled={isGenerating || !user}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" /> Generate QR Code{quantity > 1 ? 's' : ''} ({quantity})
                    </>
                  )}
                </Button>
                
                {!user && (
                  <p className="text-sm text-red-500 mt-2">
                    You must be logged in to generate QR codes
                  </p>
                )}
                
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
