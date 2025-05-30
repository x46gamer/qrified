
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Secret key for encryption - in a real app, this would be stored securely
const SECRET_KEY = 'qrcode-secret-key-improved';

// Generate a proper UUID for QR code
export const generateUniqueId = (): string => {
  return uuidv4();
};

// Encrypt the QR code data with improved approach
export const encryptData = (data: string): string => {
  try {
    if (!data || typeof data !== 'string') {
      console.error('Invalid data provided for encryption:', data);
      throw new Error('Invalid data provided for encryption');
    }

    console.log('Encrypting data:', data);
    
    // Using AES encryption with a consistent padding and mode
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    
    console.log('Encrypted data length:', encrypted.length);
    console.log('Encrypted result:', encrypted, 'length:', encrypted.length);
    return encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt QR code data');
  }
};

// Decrypt the QR code data
export const decryptData = (encryptedData: string): string => {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') {
      console.error('Invalid encrypted data provided for decryption');
      throw new Error('Invalid encrypted data provided');
    }

    console.log('Decrypting data of length:', encryptedData.length);
    console.log('Encrypted data to decrypt:', encryptedData);
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      console.error('Decryption resulted in empty data');
      throw new Error('Decryption resulted in empty data - wrong key or corrupted data');
    }
    
    console.log('Decrypted data:', decrypted);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error(`Failed to decrypt QR code data: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Generate QR code as data URL with improved options
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    if (!data || typeof data !== 'string') {
      console.error('Invalid data provided for QR generation:', data);
      throw new Error('Invalid data provided for QR generation');
    }

    console.log('Generating QR code for data:', data);
    
    // More robust QR code generation with error correction
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      margin: 1,
      width: 300,
      errorCorrectionLevel: 'H', // High error correction level
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    
    if (!qrCodeDataUrl || !qrCodeDataUrl.startsWith('data:image/png;base64,')) {
      console.error('Generated QR code is invalid');
      throw new Error('Generated QR code is invalid');
    }
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Generate QR code with template options
export const generateQRCodeImage = async (data: string, options?: {
  template?: string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
}): Promise<string> => {
  try {
    if (!data || typeof data !== 'string') {
      console.error('Invalid data provided for QR generation with template:', data);
      throw new Error('Invalid data provided for QR generation');
    }

    console.log('Generating QR code with template for data:', data);
    
    // Using higher error correction for better scanning reliability
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      margin: 1,
      width: options?.size || 300,
      errorCorrectionLevel: 'H', // High error correction level
      color: {
        dark: options?.primaryColor || '#000000',
        light: '#ffffff',
      },
    });
    
    if (!qrCodeDataUrl || !qrCodeDataUrl.startsWith('data:image/png;base64,')) {
      console.error('Generated QR code with template is invalid');
      throw new Error('Generated QR code with template is invalid');
    }
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code with template:', error);
    throw new Error('Failed to generate QR code with template');
  }
};

// Debug function to test encryption/decryption
export const testEncryptionDecryption = (testData: string): boolean => {
  try {
    console.log('Testing encryption/decryption with data:', testData);
    const encrypted = encryptData(testData);
    const decrypted = decryptData(encrypted);
    const success = decrypted === testData;
    console.log('Encryption test result:', success);
    return success;
  } catch (error) {
    console.error('Encryption test failed:', error);
    return false;
  }
};

// Format a 6-digit sequential number with leading zeros
export const formatSequentialNumber = (number: number): string => {
  return number.toString().padStart(6, '0');
};

// Analytics utilities
export const calculateScanRate = (total: number, scanned: number): number => {
  if (total === 0) return 0;
  return Math.round((scanned / total) * 100);
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

// Debug function to validate encrypted data format
export const validateEncryptedData = (encryptedData: string | null): boolean => {
  if (!encryptedData) return false;
  try {
    // Making sure we have a valid string of reasonable length
    return encryptedData.length > 20;
  } catch (error) {
    console.error('Invalid encrypted data format:', error);
    return false;
  }
};

// Function to extract the "id" parameter from a URL
export const extractQRCodeFromURL = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    // Changed from 'qr' to 'id' parameter for more clarity
    const idParam = urlObj.searchParams.get('id');
    console.log('Extracted ID param from URL:', idParam);
    return idParam;
  } catch (error) {
    console.error('Error extracting QR code ID from URL:', error);
    return null;
  }
};

// Debug utility to check if a QR code exists in the database
export const debugVerifyQRCodeInDatabase = async (id: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  if (!id) return { exists: false, message: 'No ID provided' };
  
  try {
    console.log('Debug: Checking database for QR code ID:', id);
    
    const { data, error, count } = await supabase
      .from('qr_codes')
      .select('*', { count: 'exact' })
      .eq('id', id);
    
    if (error) {
      console.error('Debug: Database error:', error);
      return { exists: false, message: `Error: ${error.message}`, error };
    }
    
    console.log('Debug: Database results:', { data, count });
    return { 
      exists: data && data.length > 0, 
      count, 
      data: data && data.length > 0 ? data[0] : null 
    };
  } catch (e) {
    console.error('Debug verification error:', e);
    return { exists: false, message: `Exception: ${e instanceof Error ? e.message : String(e)}` };
  }
};

// Direct fetch by QR code ID with detailed logging
export const fetchQRCodeById = async (id: string) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    console.log('Fetching QR code by ID:', id);
    
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching QR code by ID:', error);
      throw new Error(`Failed to fetch QR code: ${error.message}`);
    }
    
    console.log('Fetched QR code data:', data);
    
    return data ? {
      id: data.id,
      sequentialNumber: data.sequential_number,
      encryptedData: data.encrypted_data,
      url: data.url,
      isScanned: data.is_scanned,
      isEnabled: data.is_enabled,
      createdAt: data.created_at,
      scannedAt: data.scanned_at,
      dataUrl: data.data_url,
      template: data.template,
      headerText: data.header_text,
      instructionText: data.instruction_text,
      websiteUrl: data.website_url,
      footerText: data.footer_text,
      directionRTL: data.direction_rtl
    } : null;
  } catch (error) {
    console.error('Exception fetching QR code by ID:', error);
    throw error;
  }
};
