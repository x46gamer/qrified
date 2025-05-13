
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
  
  // Get appearance settings
  const themeContext = useAppearanceSettings();

  // Load appearance settings from context or directly from Supabase if needed
  useEffect(() => {
    const loadDirectSettings = async () => {
      try {
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
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('id', qrId)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Map database fields to our app's QRCode type
        if (data) {
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
          };
          
          setQrCode(mappedQr);
          
          // Check if already scanned and still enabled
          if (mappedQr.isEnabled && !mappedQr.isScanned) {
            // Decrypt data
            try {
              const decryptedData = await decryptData(mappedQr.encryptedData);
              setProductData(decryptedData);
              setIsVerified(true);
              
              // Mark as scanned
              await supabase
                .from('qr_codes')
                .update({
                  is_scanned: true,
                  scanned_at: new Date().toISOString()
                })
                .eq('id', qrId);
                
            } catch (err) {
              console.error("Decryption error:", err);
              setIsVerified(false);
            }
          } else {
            // Already scanned or disabled
            setIsVerified(false);
          }
        }
      } catch (err) {
        console.error("Error fetching QR code:", err);
        setIsVerified(false);
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
    return theme.failureDescription || "This product could not be verified as authentic. It may be counterfeit or has been previously verified.";
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
            <div className="border rounded-lg p-4 bg-gray-50 text-left">
              <h3 className="font-medium mb-2">Product Details:</h3>
              <p className="break-all">{productData}</p>
            </div>
          )}
          
          {qrCode?.websiteUrl && (
            <Button 
              variant="outline" 
              className="mt-4 w-full" 
              onClick={() => window.open(qrCode.websiteUrl, '_blank')}
              style={{ 
                borderColor: theme.primaryColor,
                color: theme.primaryColor 
              }}
            >
              Visit Website
            </Button>
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
                  Leave a Review
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
                  Give Feedback
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
