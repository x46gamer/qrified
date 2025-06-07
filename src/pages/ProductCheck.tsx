import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { QRCode } from '@/types/qrCode';
import { CheckIcon, XIcon } from 'lucide-react';
import { decryptData } from '@/utils/qrCodeUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewForm from '@/components/ReviewForm';
import FeedbackForm from '@/components/FeedbackForm';
import { AppearanceSettings, DEFAULT_SETTINGS } from '@/contexts/AppearanceContext';
import { TemplateType } from '@/types/qrCode';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { isTemplateType } from '@/utils/typeGuards';

const ProductCheck = () => {
  const [searchParams] = useSearchParams();
  const qrId = searchParams.get('id');
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [productData, setProductData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  
  // Helper function to increment failed scan attempts
  const incrementFailedAttempts = async (id: string) => {
    try {
      // First, fetch the current failed_scan_attempts value
      const { data, error: fetchError } = await supabase
        .from('qr_codes')
        .select('failed_scan_attempts')
        .eq('id', id)
        .single();

      if (fetchError) {
        return;
      }

      const currentAttempts = data?.failed_scan_attempts || 0;
      const newAttempts = currentAttempts + 1;

      // Now, update the row with the incremented value
      const { error: updateError } = await supabase
        .from('qr_codes')
        .update({ failed_scan_attempts: newAttempts })
        .eq('id', id);

      if (updateError) {
      }
    } catch (err) {
    }
  };
  
  useEffect(() => {
    const fetchQRCode = async () => {
      if (!qrId) {
        setVerificationMessage('No QR code ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*, products(name)')
          .eq('id', qrId)
          .single();
        
        if (error) {
          toast.error('Failed to fetch QR code data');
          return;
        }
        
        if (!data) {
          toast.error('QR code not found');
          return;
        }
        
        const templateValue = isTemplateType(data.template) ? data.template : 'classic';
        
        const mappedQr: QRCode = {
          id: data.id,
          sequential_number: data.sequential_number,
          encrypted_data: data.encrypted_data,
          url: data.url,
          is_scanned: data.is_scanned,
          is_enabled: data.is_enabled,
          created_at: data.created_at,
          scanned_at: data.scanned_at,
          data_url: data.data_url,
          template: templateValue,
          header_text: data.header_text,
          instruction_text: data.instruction_text,
          website_url: data.website_url,
          footer_text: data.footer_text,
          direction_rtl: data.direction_rtl,
          user_id: data.user_id,
          scanned_ip: data.scanned_ip,
          scanned_isp: data.scanned_isp,
          scanned_location: data.scanned_location,
          scanned_city: data.scanned_city,
          scanned_country: data.scanned_country,
          text: data.text,
          product_id: data.product_id,
          product: data.products
        };
        
        setQrCode(mappedQr);
        
        // --- Fetch QR Code Owner's Settings ---
        if (mappedQr.user_id) {
          const { data: settingsData, error: settingsError } = await supabase
            .from('app_settings')
            .select('settings')
            .eq('id', mappedQr.user_id) // Fetch settings by QR code owner's user_id
            .single();

          if (settingsError && settingsError.code !== 'PGRST116') {
          } else if (settingsData?.settings) {
             const ownerSettings = settingsData.settings as unknown as AppearanceSettings;
             setLocalSettings(ownerSettings);
          } else {
             setLocalSettings(DEFAULT_SETTINGS);
          }
        } else {
           setLocalSettings(DEFAULT_SETTINGS);
        }
        // --- End Fetch Logic ---
        
        // Check if QR code is valid for verification
        if (!mappedQr.is_enabled) {
          setIsVerified(false);
          setVerificationMessage(
            localSettings.isRtl 
              ? `تم مسح رمز QR هذا بالفعل في ${mappedQr.scanned_at ? new Date(mappedQr.scanned_at).toLocaleString() : 'تاريخ غير معروف'}` 
              : `This QR code was already scanned on ${mappedQr.scanned_at ? new Date(mappedQr.scanned_at).toLocaleString() : 'unknown date'}`
          );
          setIsLoading(false);
          // Increment failed attempts if disabled
          incrementFailedAttempts(qrId);
          return;
        }
        
        // If already scanned, show as not authentic
        if (mappedQr.is_scanned) {
          setIsVerified(false);
          setVerificationMessage(
            localSettings.isRtl 
              ? `تم مسح رمز QR هذا بالفعل في ${mappedQr.scanned_at ? new Date(mappedQr.scanned_at).toLocaleString() : 'تاريخ غير معروف'}` 
              : `This QR code was already scanned on ${mappedQr.scanned_at ? new Date(mappedQr.scanned_at).toLocaleString() : 'unknown date'}`
          );
          setIsLoading(false);
          // Increment failed attempts if already scanned
          incrementFailedAttempts(qrId);
          return;
        }
        
        // QR code is valid and not yet scanned - proceed with verification
        try {
          const decryptedData = await decryptData(mappedQr.encrypted_data);
          
          setProductData(decryptedData);
          
          // Mark as scanned ONLY after successful decryption
          const updateTimestamp = new Date().toISOString();
          
          let ipData = {};
          try {
              // Get user's IP address
              const ipResponse = await fetch('https://api.ipify.org?format=json');
              const ipJson = await ipResponse.json();
              const ipAddress = ipJson.ip;

              if (ipAddress) {
                  // Get geolocation details using the IP
                  const geoResponse = await fetch(`https://freeipapi.com/api/json/${ipAddress}`);
                  const geoJson = await geoResponse.json();

                  // Prepare IP and geolocation data for update
                  ipData = {
                      scanned_ip: ipAddress,
                      scanned_isp: geoJson.isp || null,
                      scanned_location: geoJson.regionName || null, // Map regionName to scanned_location
                      scanned_city: geoJson.cityName || null, // Map cityName to scanned_city
                      scanned_country: geoJson.countryName || null, // Map countryName to scanned_country
                  };
              }
          } catch (geoError) {
              toast.warning('Failed to capture IP and geolocation details.');
          }

          // Prepare the update payload including scan status and geolocation data
          const updatePayload = {
              is_scanned: true,
              scanned_at: updateTimestamp,
              ...ipData, // Include the captured IP/geo data
          };

          const { error: updateError, data: updateData } = await supabase
            .from('qr_codes')
            .update(updatePayload) // Use the combined payload
            .eq('id', qrId)
            .eq('is_scanned', false) // Race condition protection
            .select();
          
          if (updateError) {
            setIsVerified(true);
            setVerificationMessage('Product verified successfully (scan status update failed)');
            // Increment failed attempts on update error
            incrementFailedAttempts(qrId);
          } else if (!updateData || updateData.length === 0) {
            setIsVerified(false);
            setVerificationMessage('This QR code was just scanned by another request');
            // Increment failed attempts on race condition
            incrementFailedAttempts(qrId);
          } else {
            setIsVerified(true);
            setVerificationMessage('Product verified successfully');
            // DO NOT increment failed attempts on successful scan
          }
              
        } catch (decryptError) {
          setIsVerified(false);
          setVerificationMessage('Failed to decrypt QR code data - may be corrupted or invalid');
          // Increment failed attempts on decryption error
          incrementFailedAttempts(qrId);
        }
      } catch (err) {
        setIsVerified(false);
        setVerificationMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
        // Increment failed attempts on unexpected error during fetch
        incrementFailedAttempts(qrId);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQRCode();
  }, [qrId]);
  
  // Get the active settings to use
  const theme = localSettings;
  
  // Helper functions
  const getBgColor = () => {
    if (isLoading) return 'bg-gray-100';
    if (isVerified === null) return 'bg-blue-100';
    return isVerified ? 'bg-green-100' : 'bg-red-100';
  };
  
  const getTextColor = () => {
    if (isLoading) return 'text-gray-800';
    if (isVerified === null) return 'text-blue-800';
    return isVerified ? 'text-green-800' : 'text-red-800';
  };
  
  const getIconColor = () => {
    if (isLoading) return 'text-gray-500';
    if (isVerified === null) return 'text-blue-500';
    return isVerified ? 'text-green-500' : 'text-red-500';
  };
  
  // Get the appropriate content based on verification status
  const getTitle = () => {
    if (isLoading) return 'Verifying...';
    if (isVerified === null) return 'Checking QR Code...';
    // Use title from settings, fallback to default if not set
    return isVerified ? (theme.successTitle || DEFAULT_SETTINGS.successTitle) : (theme.failureTitle || DEFAULT_SETTINGS.failureTitle);
  };
  
  const getDescription = () => {
    if (isLoading) return 'Please wait while we verify the QR code...';
    if (isVerified === null) return 'Connecting to server...';
    // Use description from settings for success/failure, otherwise use specific messages
    if (isVerified === true) return theme.successDescription || DEFAULT_SETTINGS.successDescription;
    if (isVerified === false) return theme.failureDescription || DEFAULT_SETTINGS.failureDescription;
    return verificationMessage; // Fallback for specific error messages if needed
  };
  
  const getFooterText = () => {
    // Use footer text from settings for success/failure, otherwise maybe null or a general message?
    // For now, let's use the success/failure footer texts based on status
    if (isVerified === true) return theme.successFooterText || DEFAULT_SETTINGS.successFooterText;
    if (isVerified === false) return theme.failureFooterText || DEFAULT_SETTINGS.failureFooterText;
    return null; // No footer text when loading or pending
  };
  
  const renderTemplateContent = () => {
    if (!qrCode) return null; // Or a loading/error state

    return (
      <div className="p-4">
        {/* Removed hardcoded header and product name. Main title and description handled outside. */}
        {/* Instruction text is also handled by getDescription */}

        {isVerified === true && productData && (
          <div className="text-center text-green-700 font-bold mb-4">
            {theme.isRtl ? 'إسم المنتج:' : 'Authentic Product Data:'} {productData}
          </div>
        )}
        {isVerified === false && (
           <div className="text-center text-red-700 font-bold mb-4">
             {verificationMessage}
           </div>
        )}
        {/* Footer text is now handled outside renderTemplateContent */}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Verifying product authenticity...</p>
        </div>
      </div>
    );
  }
  
  if (!qrId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Missing QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <XIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p>No QR code ID provided. Please scan a valid QR code.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 space-y-4">
      {/* Add the logo here */}
      {localSettings.logoUrl && (
        <img 
          src={localSettings.logoUrl} 
          alt="Brand Logo" 
          className="mx-auto mb-4" 
          style={{ width: '70%', height: 'auto' }} // Adjusted width to 70%
        />
      )}
      {/* Apply RTL direction based on settings */}
      <Card className={`w-full max-w-md shadow-lg ${getBgColor()} ${getTextColor()}`} dir={localSettings.isRtl ? 'rtl' : 'ltr'}> {/* Use localSettings for dir */}
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : isVerified ? <CheckIcon className={`w-6 h-6 ${getIconColor()}`} /> : <XIcon className={`w-6 h-6 ${getIconColor()}`} />}
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* The main content of the verification page */}
          <div className="text-center">
            {/* Logo is now above the card */}
            {/* Display the description from appearance settings or specific messages */}
            <p className="text-sm mb-2">{getDescription()}</p>

            {/* Render template-specific content if available and not loading */}
            {!isLoading && renderTemplateContent()}

            {/* Display the footer text from appearance settings when verified or failed */}
            {(isVerified === true || isVerified === false) && getFooterText() && (
              <p className="text-xs mt-4">{getFooterText()}</p>
            )}
          </div>

          {isVerified === true && localSettings.enableReviews && localSettings.enableFeedback && (
            <div className="flex flex-col space-y-4 mt-6">
               {/* Use button text from settings, fallback to default */}
               <Button
                 onClick={() => setShowReviews(true)}
                 style={{ backgroundColor: localSettings.primaryColor, borderColor: localSettings.primaryColor, color: 'white' }}
                 className="hover:opacity-90 transition-opacity"
               >
                 {localSettings.reviewButtonText || DEFAULT_SETTINGS.reviewButtonText}
               </Button>
               {/* Use button text from settings, fallback to default */}
               <Button
                 onClick={() => setShowFeedback(true)}
                 style={{ backgroundColor: localSettings.primaryColor, borderColor: localSettings.primaryColor, color: 'white' }}
                 className="hover:opacity-90 transition-opacity"
               >
                 {localSettings.feedbackButtonText || DEFAULT_SETTINGS.feedbackButtonText}
               </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditionally render ReviewForm below the card when verified, reviews are enabled, and the button is clicked */}
      {isVerified === true && localSettings.enableReviews && showReviews && (
        <div className="w-full max-w-md transition-opacity duration-500 opacity-100">
          <ReviewForm qrId={qrCode?.id} onClose={() => setShowReviews(false)} isRtl={localSettings.isRtl} />
        </div>
      )}

      {/* Conditionally render FeedbackForm below the card when verified, feedback is enabled, and the button is clicked */}
      {isVerified === true && localSettings.enableFeedback && showFeedback && (
        <div className="w-full max-w-md transition-opacity duration-500 opacity-100">
          <FeedbackForm qrId={qrCode?.id} onClose={() => setShowFeedback(false)} isRtl={localSettings.isRtl} />
        </div>
      )}
    </div>
  );
};

export default ProductCheck;
