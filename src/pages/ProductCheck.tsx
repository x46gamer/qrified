
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { decryptData } from '@/utils/qrCodeUtils';
import { supabase } from '@/integrations/supabase/client';

const ProductCheck = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateQRCode = async () => {
      try {
        const encryptedData = searchParams.get('qr');
        
        if (!encryptedData) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        
        // Query the database for the QR code
        const { data: qrCode, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('encrypted_data', encryptedData)
          .single();
        
        if (error || !qrCode) {
          console.error('Error fetching QR code:', error);
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        
        // Check if the QR code is enabled and not scanned
        if (qrCode.is_enabled && !qrCode.is_scanned) {
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
          }
          
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Error validating QR code:', error);
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
              <div className="w-24 h-24 bg-verified rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-center text-verified">Product Verified</h1>
            
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
            <div className="w-24 h-24 bg-counterfeit rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-center text-counterfeit">Not Authentic</h1>
          
          <p className="mt-4 text-lg text-center">
            This product could not be verified as authentic. It may be counterfeit or has been previously verified.
          </p>
          
          <div className="mt-8 bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-center text-red-800">
              If you believe this is an error, please contact the product manufacturer.
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
};

export default ProductCheck;
