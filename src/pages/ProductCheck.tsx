import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { QRCode, TemplateType } from '@/types/qrCode';
import { CheckIcon, XIcon } from 'lucide-react';
import { decryptData } from '@/utils/qrCodeUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewForm from '@/components/ReviewForm';
import { useAppearanceSettings } from '@/contexts/AppearanceContext';
import type { ThemeSettings } from '@/contexts/AppearanceContext';

const ProductCheck = () => {
  const [searchParams] = useSearchParams();
  const qrId = searchParams.get('id');
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [productData, setProductData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  
  // Get appearance settings
  const theme = useAppearanceSettings();
  
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
      className={`min-h-screen flex flex-col items-center justify-center p-4`}
      style={{ backgroundColor: getBgColor(), color: getTextColor(), direction: qrCode?.directionRTL ? 'rtl' : 'ltr' }}
    >
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
            >
              Visit Website
            </Button>
          )}
          
          {isVerified && theme.enableReviews && (
            <div className="pt-4">
              {showReviews ? (
                <ReviewForm 
                  qrId={qrId} 
                  successBackground={theme.successBackground || "#f0fdf4"} 
                  successText={theme.successText || "#16a34a"} 
                />
              ) : (
                <Button onClick={() => setShowReviews(true)}>Leave a Review</Button>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4">{getFooterText()}</p>
        </CardContent>
      </Card>
    </div>
  );
  
  // Helper functions
  function getBgColor() {
    if (isVerified === true) {
      return theme.successBackground || "#f0fdf4"; // green-50
    } else if (isVerified === false) {
      return theme.failureBackground || "#fef2f2"; // red-50
    }
    return "bg-white";
  }
  
  function getTextColor() {
    if (isVerified === true) {
      return theme.successText || "#16a34a"; // green-600
    } else if (isVerified === false) {
      return theme.failureText || "#dc2626"; // red-600
    }
    return "text-gray-700";
  }
  
  function getIconColor() {
    if (isVerified === true) {
      return theme.successIcon || "#22c55e"; // green-500
    } else if (isVerified === false) {
      return theme.failureIcon || "#ef4444"; // red-500
    }
    return "#6b7280"; // gray-500
  }
  
  // Get the appropriate content based on verification status
  function getTitle() {
    if (isVerified === true) {
      return theme.successTitle || "Product Verified";
    }
    return theme.failureTitle || "Not Authentic";
  }
  
  function getDescription() {
    if (isVerified === true) {
      return theme.successDescription || "This product is legitimate and original. Thank you for checking its authenticity.";
    }
    return theme.failureDescription || "This product could not be verified as authentic. It may be counterfeit or has been previously verified.";
  }
  
  function getFooterText() {
    if (isVerified === true) {
      return theme.successFooterText || "This QR code has been marked as used and cannot be verified again.";
    }
    return theme.failureFooterText || "If you believe this is an error, please contact the product manufacturer.";
  }
};

export default ProductCheck;
