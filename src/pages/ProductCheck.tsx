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
import { useAppearanceSettings, AppearanceSettings, DEFAULT_SETTINGS } from '@/contexts/AppearanceContext';
import { TemplateType } from '@/types/qrCode';
import { toast } from 'sonner';

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
  
  // Get appearance settings
  const themeContext = useAppearanceSettings();

  // Load appearance settings from context or directly from Supabase if needed
  useEffect(() => {
    const loadDirectSettings = async () => {
      try {
        // Load settings directly from Supabase (for all users)
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'theme')
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Direct settings load error:', error);
          return;
        }
        
        if (data?.settings) {
          const loadedSettings = data.settings as unknown as AppearanceSettings;
          console.log('Direct loaded settings:', loadedSettings);
          setLocalSettings(prev => ({
            ...prev,
            ...loadedSettings
          }));
        }
      } catch (err) {
        console.error('Error loading direct settings:', err);
      }
    };
    
    // First try to use context settings
    if (!themeContext.isLoading) {
      console.log('Using context settings:', themeContext);
      setLocalSettings({
        ...DEFAULT_SETTINGS,
        ...themeContext
      });
    } else {
      // If context is loading, try direct load
      loadDirectSettings();
    }
    
    // Listen for settings updates from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appearance_updated') {
        loadDirectSettings();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [themeContext]);
  
  useEffect(() => {
    const fetchQRCode = async () => {
      if (!qrId) {
        console.log('No QR ID provided');
        setVerificationMessage('No QR code ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching QR code with ID:', qrId);
        
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('id', qrId)
          .single();
        
        if (error) {
          console.error('Error fetching QR code:', error);
          setIsVerified(false);
          setVerificationMessage(`Database error: ${error.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          console.log('No QR code found with this ID');
          setIsVerified(false);
          setVerificationMessage('QR code not found in database');
          setIsLoading(false);
          return;
        }
        
        console.log('QR code data retrieved:', data);
        
        const templateValue = data.template as TemplateType || 'classic';
        
        const mappedQr: QRCode = {
          id: data.id,
          sequentialNumber: data.sequential_number,
          encryptedData: data.encrypted_data,
          url: data.url,
          isScanned: data.is_scanned,
          isEnabled: data.is_enabled,
          createdAt: data.created_at,
          scannedAt: data.scanned_at,
          dataUrl: data.data_url,
          template: templateValue,
          headerText: data.header_text,
          instructionText: data.instruction_text,
          websiteUrl: data.website_url,
          footerText: data.footer_text,
          directionRTL: data.direction_rtl,
          userId: data.user_id,
        };
        
        setQrCode(mappedQr);
        console.log('QR code status - isEnabled:', mappedQr.isEnabled, 'isScanned:', mappedQr.isScanned);
        
        // Check if QR code is valid for verification
        if (!mappedQr.isEnabled) {
          console.log('QR code is disabled');
          setIsVerified(false);
          setVerificationMessage('This QR code has been disabled');
          setIsLoading(false);
          return;
        }
        
        // If already scanned, show as not authentic
        if (mappedQr.isScanned) {
          console.log('QR code already scanned at:', mappedQr.scannedAt);
          setIsVerified(false);
          setVerificationMessage(`This QR code was already scanned on ${mappedQr.scannedAt ? new Date(mappedQr.scannedAt).toLocaleString() : 'unknown date'}`);
          setIsLoading(false);
          return;
        }
        
        // QR code is valid and not yet scanned - proceed with verification
        try {
          console.log('Attempting to decrypt data:', mappedQr.encryptedData);
          const decryptedData = await decryptData(mappedQr.encryptedData);
          console.log('Successfully decrypted data:', decryptedData);
          
          setProductData(decryptedData);
          
          // Mark as scanned ONLY after successful decryption
          console.log('Marking QR code as scanned');
          const updateTimestamp = new Date().toISOString();
          
          let ipData = {};
          try {
              // Get user's IP address
              const ipResponse = await fetch('https://api.ipify.org?format=json');
              const ipJson = await ipResponse.json();
              const ipAddress = ipJson.ip;
              console.log('Detected IP address:', ipAddress);

              if (ipAddress) {
                  // Get geolocation details using the IP
                  const geoResponse = await fetch(`https://freeipapi.com/api/json/${ipAddress}`);
                  const geoJson = await geoResponse.json();
                  console.log('Geolocation data:', geoJson);

                  // Prepare IP and geolocation data for update
                  ipData = {
                      scanned_ip: ipAddress,
                      scanned_isp: geoJson.isp || null,
                      scanned_location: geoJson.location || null, // freeipapi uses 'location'
                      scanned_city: geoJson.city || null,
                      scanned_country: geoJson.country || null,
                  };
              }
          } catch (geoError) {
              console.error('Error fetching IP or geolocation data:', geoError);
              // Continue with the scan update even if geolocation fails
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
            console.error('Error updating QR code scan status:', updateError);
            setIsVerified(true);
            setVerificationMessage('Product verified successfully (scan status update failed)');
          } else if (!updateData || updateData.length === 0) {
            console.log('QR code was already scanned by another request');
            setIsVerified(false);
            setVerificationMessage('This QR code was just scanned by another request');
          } else {
            console.log('QR code marked as scanned successfully:', updateData);
            setIsVerified(true);
            setVerificationMessage('Product verified successfully');
          }
              
        } catch (decryptError) {
          console.error("Decryption error:", decryptError);
          setIsVerified(false);
          setVerificationMessage('Failed to decrypt QR code data - may be corrupted or invalid');
        }
      } catch (err) {
        console.error("Error fetching QR code:", err);
        setIsVerified(false);
        setVerificationMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
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
    if (isVerified === true) {
      return theme.successBackground || "#f0fdf4"; // green-50
    } else if (isVerified === false) {
      return theme.failureBackground || "#fef2f2"; // red-50
    }
    return "bg-white";
  };
  
  const getTextColor = () => {
    if (isVerified === true) {
      return theme.successText || "#16a34a"; // green-600
    } else if (isVerified === false) {
      return theme.failureText || "#dc2626"; // red-600
    }
    return "text-gray-700";
  };
  
  const getIconColor = () => {
    if (isVerified === true) {
      return theme.successIcon || "#22c55e"; // green-500
    } else if (isVerified === false) {
      return theme.failureIcon || "#ef4444"; // red-500
    }
    return "#6b7280"; // gray-500
  };
  
  // Get the appropriate content based on verification status
  const getTitle = () => {
    if (isVerified === true) {
      return theme.successTitle || "Product Verified";
    }
    return theme.failureTitle || "Not Authentic";
  };
  
  const getDescription = () => {
    if (isVerified === true) {
      return theme.successDescription || "This product is legitimate and original. Thank you for checking its authenticity.";
    }
    return theme.failureDescription || verificationMessage || "This product could not be verified as authentic. It may be counterfeit or has been previously verified.";
  };
  
  const getFooterText = () => {
    if (isVerified === true) {
      return theme.successFooterText || "This QR code has been marked as used and cannot be verified again.";
    }
    return theme.failureFooterText || "If you believe this is an error, please contact the product manufacturer.";
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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ 
        backgroundColor: getBgColor(), 
        color: getTextColor(), 
        direction: theme.isRtl || (qrCode?.directionRTL) ? 'rtl' : 'ltr' 
      }}
    >
      {theme.logoUrl && (
        <div className="mb-4 max-w-[200px]">
          <img src={theme.logoUrl} alt="Brand Logo" className="w-full object-contain" />
        </div>
      )}
      
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" style={{ color: getTextColor() }}>
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {isVerified ? (
            <CheckIcon className="h-16 w-16 mx-auto" style={{ color: getIconColor() }} />
          ) : (
            <XIcon className="h-16 w-16 mx-auto" style={{ color: getIconColor() }} />
          )}
          
          <p className="text-lg">{getDescription()}</p>
          
          
          
          {isVerified && productData && (
            <div className="border border-gray-200 rounded-lg px-6 py-4 bg-gray-100 shadow-md text-left">
              <h3 className="font-medium mb-2">Product Details:</h3>
              <p className="break-all">{productData}</p>
            </div>
          )}
          
          {isVerified && theme.enableReviews && (
            <div className="pt-4">
              {!showReviews ? (
                <Button 
                  onClick={() => setShowReviews(true)}
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    color: '#ffffff' 
                  }}
                >
                  {theme.reviewButtonText || 'Leave a Review'}
                </Button>
              ) : (
                <ReviewForm 
                  qrId={qrId} 
                  successBackground={theme.successBackground || "#f0fdf4"} 
                  successText={theme.successText || "#16a34a"} 
                />
              )}
            </div>
          )}
          
          {isVerified && theme.enableFeedback && (
            <div className="pt-2">
              {!showFeedback ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowFeedback(true)}
                  style={{ 
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor 
                  }}
                >
                  {theme.feedbackButtonText || 'Give Feedback'}
                </Button>
              ) : (
                <FeedbackForm 
                  qrId={qrId}
                  successBackground={theme.successBackground || "#f0fdf4"} 
                  successText={theme.successText || "#16a34a"}
                />
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4">{getFooterText()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCheck;
