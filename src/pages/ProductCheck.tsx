
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { decryptData, validateEncryptedData, debugVerifyQRCodeInDatabase } from '@/utils/qrCodeUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProductCheck = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [rawEncryptedData, setRawEncryptedData] = useState<string | null>(null);
  const [detailedDebugInfo, setDetailedDebugInfo] = useState<any>(null);

  useEffect(() => {
    const validateQRCode = async () => {
      try {
        const encryptedData = searchParams.get('qr');
        setRawEncryptedData(encryptedData);
        console.log('Received encrypted data:', encryptedData);
        
        if (!encryptedData) {
          console.error('No encrypted data found in URL');
          setDebugInfo('Missing QR data in URL');
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        
        // Validate the encrypted data format
        if (!validateEncryptedData(encryptedData)) {
          console.error('Invalid encrypted data format');
          setDebugInfo('Invalid QR code format');
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        // Perform a debug check to see if the QR code exists in the database
        const debugVerifyResult = await debugVerifyQRCodeInDatabase(encryptedData);
        setDetailedDebugInfo(debugVerifyResult);
        console.log('Debug verification result:', debugVerifyResult);
        
        if (!debugVerifyResult.exists) {
          setDebugInfo(`QR code not found in database: ${debugVerifyResult.message || 'No matching record'}`);
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        // Query the database for the QR code - IMPORTANT: Using .maybeSingle() instead of .single()
        console.log('Querying database for QR code:', encryptedData);
        const { data: qrCode, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('encrypted_data', encryptedData)
          .maybeSingle(); // Using maybeSingle() instead of single() to avoid errors when no records are found
        
        console.log('Database response:', { qrCode, error });
        
        if (error) {
          console.error('Error fetching QR code:', error);
          setDebugInfo(`Database error: ${error.message}`);
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        
        if (!qrCode) {
          console.error('QR code not found in database');
          setDebugInfo('QR code not found in database');
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        console.log('QR code found:', qrCode);
        
        // Check if the QR code is enabled and not scanned
        if (qrCode.is_enabled && !qrCode.is_scanned) {
          console.log('QR code is valid and not scanned');
          
          // Mark as scanned
          const { error: updateError } = await supabase
            .from('qr_codes')
            .update({
              is_scanned: true,
              scanned_at: new Date().toISOString()
            })
            .eq('id', qrCode.id);
          
          if (updateError) {
            console.error('Error updating QR code:', updateError);
            setDebugInfo(`Error marking as scanned: ${updateError.message}`);
            // Still consider valid even if update fails
          }
          
          toast.success('Product authenticated successfully');
          setIsValid(true);
        } else {
          console.log('QR code is either disabled or already scanned', {
            is_enabled: qrCode.is_enabled,
            is_scanned: qrCode.is_scanned
          });
          
          if (!qrCode.is_enabled) {
            setDebugInfo('QR code is disabled');
          } else if (qrCode.is_scanned) {
            setDebugInfo('QR code has already been scanned');
          }
          
          setIsValid(false);
        }
      } catch (error) {
        console.error('Error validating QR code:', error);
        setDebugInfo(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    validateQRCode();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Verifying product authenticity...</p>
        </div>
      </div>
    );
  }

  if (isValid === true) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-center text-green-600">Product Verified</h1>
            
            <p className="mt-4 text-lg text-center">
              This product is legitimate and original. Thank you for checking its authenticity.
            </p>
            
            <div className="mt-8 bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-center text-green-800">
                This QR code has been marked as used and cannot be verified again.
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-center text-red-600">Not Authentic</h1>
          
          <p className="mt-4 text-lg text-center">
            This product could not be verified as authentic. It may be counterfeit or has been previously verified.
          </p>
          
          <div className="mt-8 p-4 rounded-lg">
            <p className="text-sm text-center text-red-800">
              If you believe this is an error, please contact the product manufacturer.
            </p>
            {debugInfo && (
              <Alert className="mt-3 bg-red-50 border-red-200">
                <AlertDescription className="text-xs text-red-700">
                  Debug info: {debugInfo}
                </AlertDescription>
              </Alert>
            )}
            {rawEncryptedData && (
              <Alert className="mt-3 bg-red-50 border-red-200">
                <AlertDescription className="text-xs text-red-700 break-all">
                  Raw QR code: {rawEncryptedData}
                </AlertDescription>
              </Alert>
            )}
            {detailedDebugInfo && (
              <Alert className="mt-3 bg-red-50 border-red-200">
                <AlertDescription className="text-xs text-red-700">
                  <details>
                    <summary>Detailed debug info (click to expand)</summary>
                    <pre className="text-xs mt-2 overflow-x-auto">
                      {JSON.stringify(detailedDebugInfo, null, 2)}
                    </pre>
                  </details>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCheck;
