import React, { useState, useEffect, useRef } from 'react';
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
import { toPng } from 'html-to-image';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';

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
  productId?: string;
  showLogo?: boolean;
}

interface Product {
  id: string;
  name: string;
  footerText: "Thank you for choosing our product";
  websiteUrl: "";
  isRTL: false;
  showLogo: false;
}

const DEFAULT_VALUES: FormValues = {
  quantity: 1,
  productData: "",
  template: "classic",
  baseUrl: import.meta.env.VITE_APP_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''), // Use env var, fallback to window.location.origin
  headerText: "Product Authentication",
  instructionText: "Scan this QR code to verify the authenticity of your product",
  footerText: "Thank you for choosing our product",
  websiteUrl: "",
  isRTL: false,
  showLogo: false
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
  const showLogo = watch('showLogo');
  const { logoUrl } = useAppearanceSettings();

  const templatePreviewRef = useRef<HTMLDivElement>(null);

  // State for product management
  const [newProductName, setNewProductName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

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
      console.log("fetchVerifiedDomains called");
      if (!user) {
        console.log("User not available, skipping domain fetch.");
        return;
      }

      setIsLoadingDomains(true);
      try {
        console.log("Fetching verified domains from Supabase...");
        const { data, error } = await supabase
          .from('custom_domains')
          .select('id, domain')
          .eq('status', 'verified')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching domains:', error);
          return;
        }

        console.log("Verified domains fetched:", data);
        setVerifiedDomains(data || []);
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setIsLoadingDomains(false);
        console.log("Domain fetch completed.");
      }
    };

    fetchVerifiedDomains();
  }, [user]);

  // Set the base URL on component mount if window is defined or env var exists
  useEffect(() => {
    if (import.meta.env.VITE_APP_BASE_URL) {
       setValue('baseUrl', import.meta.env.VITE_APP_BASE_URL);
    } else if (typeof window !== 'undefined') {
      setValue('baseUrl', window.location.origin);
    }
  }, [setValue]);

  // Fetch user's products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) {
        console.log('User not logged in, skipping product fetch.');
        return;
      }

      console.log('Fetching products for user:', user.id);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        console.log('Products fetched:', data);
        setProducts(data || []);
        console.log('Products state updated:', data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [user]);

  // Generate a preview QR code whenever template or colors change
  useEffect(() => {
    const generatePreview = async () => {
      if (typeof window === 'undefined' && !import.meta.env.VITE_APP_BASE_URL) return; // Don't run on server without env var
      try {
        // Use environment variable for preview URL if available, otherwise fallback to window.location.origin
        const previewUrl = `${import.meta.env.VITE_APP_BASE_URL || window.location.origin}/check?id=preview`;
        const dataUrl = await generateQRCodeImage(previewUrl, {
          template,
          primaryColor,
          secondaryColor,
          size: 256, // This is the internal QR image size, container will style it
          showLogo: showLogo,
          logoUrl: showLogo ? logoUrl : null,
        });
        setPreviewQRCode(dataUrl);
      } catch (error) {
        console.error('Error generating preview QR code:', error);
      }
    };

    generatePreview();
  }, [template, primaryColor, secondaryColor, showLogo, logoUrl]);

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

      // Check if a product is selected or a new product name is entered
      if ((!newProductName || newProductName.trim() === '') && !selectedProductId) {
        console.log('No product selected/entered. Checking products array:');
        console.log('  newProductName:', newProductName);
        console.log('  selectedProductId:', selectedProductId);
        console.log('  products.length:', products.length);

        if (products.length === 0) {
          toast.info('You need to add a product to create QR codes.');
        } else {
          toast.error('Please enter or select a product.');
        }
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

      const qrCodesToInsert = [];
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
        const currentSeqNumber = startingSeqNumber + i;
        const sequentialNumberString = String(currentSeqNumber).padStart(6, '0');
        const qrCodeId = uuidv4(); // Generate a UUID for the QR code
        const checkUrl = `${data.baseUrl}/check?id=${qrCodeId}`;
        const encryptedValue = await encryptData(data.productData); // Replace with your actual key

        qrCodesToInsert.push({
          id: qrCodeId,
          sequential_number: currentSeqNumber, // Save as number
          encrypted_data: encryptedValue, // Corrected to snake_case
          url: checkUrl,
          is_scanned: false,
          is_enabled: true, // Corrected to snake_case
          user_id: user.id, // Associate with the logged-in user
          data_url: '', // Will be populated after image generation
          template: data.template,
          header_text: data.headerText,
          instruction_text: data.instructionText,
          website_url: data.websiteUrl,
          footer_text: data.footerText,
          direction_rtl: data.isRTL,
          product_id: selectedProductId, // Include the selected product ID
          show_logo: data.showLogo, // Changed from showLogo to show_logo
          logo_url: data.showLogo ? logoUrl : null,
        });
      }

      // Generate the QR Code images and update data_url
      const generatedQrCodesWithImages = [];
      for (let i = 0; i < qrCodesToInsert.length; i++) {
        const qrCode = qrCodesToInsert[i];
        const qrCodeOnlyDataUrl = await generateQRCodeImage(qrCode.url, {
          template: qrCode.template,
          primaryColor,
          secondaryColor,
          size: 300,
          showLogo: qrCode.show_logo,
          logoUrl: qrCode.logo_url,
        });

        if (!qrCodeOnlyDataUrl || !qrCodeOnlyDataUrl.startsWith('data:image/png;base64,')) {
          throw new Error('QR code generation failed or produced invalid data URL');
        }

        console.log('Generated QR code only data URL length:', qrCodeOnlyDataUrl.length);

        // Update the preview state to show the newly generated QR code and template data
        setPreviewQRCode(qrCodeOnlyDataUrl);
        // We also need to ensure other preview state is updated if necessary, e.g., colors, text
        // For now, assuming the component already watches the form data and colors via `watch` and state

        // Wait for the DOM to update with the new preview and for the inner image to load
        if (templatePreviewRef.current) {
            await new Promise<void>((resolve, reject) => {
                // A small timeout to allow React to update the DOM
                setTimeout(() => {
                    const imgElement = templatePreviewRef.current?.querySelector('img');
                    if (imgElement) {
                        if (imgElement.complete && imgElement.naturalHeight !== 0) {
                            // Image is already loaded
                            resolve();
                        } else {
                            imgElement.onload = () => resolve();
                            imgElement.onerror = (e) => {
                                console.error('Error loading inner QR code image in preview:', e);
                                resolve(); // Resolve to attempt capture anyway
                            };
                        }
                    } else {
                        // No image found, proceed without waiting for image load
                        console.warn('No image element found in preview div.');
                        resolve();
                    }
                }, 100); // Small delay to allow DOM update
            });
        }

        // Capture the rendered preview component as a PNG image
        let dataUrl = '';
        if (templatePreviewRef.current) {
            try {
               dataUrl = await toPng(templatePreviewRef.current, {
                cacheBust: true,
                skipFonts: true,
              });
            } catch (imgCaptureError) {
                console.error('Error capturing preview image:', imgCaptureError);
                // Fallback: use the QR code only if capture fails
                dataUrl = qrCodeOnlyDataUrl;
                toast.warning('Failed to capture full QR code template image from preview, using QR code only.');
            }
        } else {
             console.error('Template preview ref is not available for capture.');
             // Fallback if ref is not available
             dataUrl = qrCodeOnlyDataUrl;
             toast.warning('Template preview not available for capture, using QR code only.');
        }

        if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
          // If image capture failed and fallback didn't work or produced invalid data
          throw new Error('Failed to generate QR code template image.');
        }

        console.log('Generated QR code template image data URL length:', dataUrl.length);

        // Ensure correct properties for DB insertion
        const qrCodeWithImage = {
          ...qrCode, // This spread includes other properties like encrypted_data and is_enabled (now corrected)
          // Overwrite or ensure correct properties for DB
          data_url: dataUrl, // Use snake_case for image data
          dataUrl: undefined, // Explicitly set camelCase to undefined
          logo_url: qrCode.logo_url, // Ensure logo_url is used (snake_case)
          logoUrl: undefined, // Explicitly set camelCase to undefined
          show_logo: qrCode.show_logo, // Ensure show_logo is used (snake_case)
          showLogo: undefined, // Explicitly set camelCase to undefined
          // encrypted_data and is_enabled should already be correct from qrCode spread
        };

        generatedQrCodesWithImages.push(qrCodeWithImage);
      }

      try {
        console.log('Saving QR codes to database:', generatedQrCodesWithImages.length, 'codes');
        console.log('QR codes user_id:', generatedQrCodesWithImages[0]?.user_id);

        // Filter out any undefined values before inserting
        const cleanGeneratedQrCodes = generatedQrCodesWithImages.map(qr => {
            const cleanQr: any = {};
            for (const key in qr) {
                if (qr[key] !== undefined) {
                    cleanQr[key] = qr[key];
                }
            }
            return cleanQr;
        });


        const { error } = await supabase
          .from('qr_codes')
          .insert(cleanGeneratedQrCodes);

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

        const mappedQrCodes = generatedQrCodesWithImages.map(qr => ({
          id: qr.id,
          sequentialNumber: qr.sequential_number,
          dataUrl: qr.data_url, // Use the corrected data_url
          template: qr.template,
          headerText: qr.header_text,
          instructionText: qr.instruction_text,
          websiteUrl: qr.website_url,
          footerText: qr.footer_text,
          directionRTL: qr.direction_rtl,
          userId: qr.user_id,
          showLogo: qr.show_logo, // Map show_logo back to showLogo for frontend use
          logoUrl: qr.logo_url, // Map logo_url back to logoUrl for frontend use
          // Include other relevant fields if needed by onQRCodesGenerated consumers
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

                {/* Product Management Section */}
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newProductName"
                      placeholder="Enter new product name"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={async () => {
                        console.log('User ID being sent:', user?.id);

                        if (!newProductName.trim()) {
                          toast.error('Please enter a product name.');
                          return;
                        }
                        if (!user) {
                          toast.error('You must be logged in to add a product.');
                          return;
                        }

                        try {
                          // Reverted to the standard insert call without .auth()
                          const { data, error } = await supabase
                            .from('products')
                            .insert([{ name: newProductName.trim(), user_id: user.id }])
                            .select('id, name')
                            .single();

                          if (error) {
                            throw error;
                          }

                          if (data) {
                            setProducts([...products, data]);
                            setSelectedProductId(data.id);
                            setValue('productId', data.id); // Set productId in form values
                            // Optional: Clear new product input after adding and selecting
                            setNewProductName('');
                            toast.success('Product added successfully!');
                          }
                        } catch (error: any) {
                          console.error('Error adding product:', error);
                          // Check if the error is specifically the RLS violation
                          if (error.code === '42501' && error.message.includes('row-level security policy')) {
                              toast.error('Failed to add product due to security policy. Ensure you are logged in and the policy is correctly configured.');
                          } else {
                              toast.error(`Failed to add product: ${error.message}`);
                          }
                        }
                      }}
                    >
                      Add Product
                    </Button>
                  </div>
                  <Select
                    value={selectedProductId}
                    onValueChange={(value) => {
                      setSelectedProductId(value);
                      setValue('productId', value); // Set productId in form values
                      // You might want to set productData here as well if it's used for display
                      const selectedProduct = products.find(p => p.id === value);
                      if (selectedProduct) {
                         setValue('productData', selectedProduct.name); // Set productData to product name for encryption
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select or add a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                 {/* Product Data Input - Keep this for the data to be encrypted */}
                 <div className="hidden">
                   <Label htmlFor="productData">Product Data to Encrypt</Label>
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
                     This data will be encrypted and embedded in the QR code. It can be the product name or other relevant details.
                   </p>
                 </div>


                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Base URL for Verification</Label>
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showLogo"
                    {...register('showLogo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="showLogo">Show Logo in QR Code</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>QR Code Content</CardTitle>
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
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
                    <TabsTrigger value="classic">Original</TabsTrigger>
                    <TabsTrigger value="modern-blue">Modern Blue</TabsTrigger>
                    <TabsTrigger value="modern-beige">Modern Beige</TabsTrigger>
                    <TabsTrigger value="arabic">Modern Green</TabsTrigger>
                  </TabsList>

                  <div className="mt-4 flex justify-center items-center"> {/* Added items-center */}
                    {/* Changed dimensions here */}
                    <div
                        className="w-[250px] h-[400px] border rounded-md flex justify-center items-center"
                        ref={templatePreviewRef} // Attach the ref here
                    >
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
                        showLogo={showLogo}
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