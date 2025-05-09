
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid'; 

// Secret key for encryption
const SECRET_KEY = 'qrcode-secret-key';

// Generate a proper UUID for QR code
export const generateUniqueId = (): string => {
  return uuidv4();
};

// Encrypt the QR code data
export const encryptData = (data: string): string => {
  console.log('Encrypting data:', data);
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    console.log('Encrypted data:', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt QR code data');
  }
};

// Decrypt the QR code data
export const decryptData = (encryptedData: string): string => {
  try {
    console.log('Decrypting data:', encryptedData);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    console.log('Decrypted data:', decrypted);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt QR code data');
  }
};

// Generate QR code as data URL
export const generateQRCode = async (data: string, options = {}): Promise<string> => {
  try {
    const defaultOptions = {
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    };
    
    return await QRCode.toDataURL(data, { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Format a 6-digit number with leading zeros
export const formatSequentialNumber = (number: number | string): string => {
  if (typeof number === 'number') {
    return number.toString().padStart(6, '0');
  }
  return number;
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
    console.log('Validating encrypted data:', encryptedData);
    return encryptedData.length > 20; 
  } catch (error) {
    console.error('Invalid encrypted data format:', error);
    return false;
  }
};

// Function to extract the "qr" parameter from a URL
export const extractQRCodeFromURL = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const qrParam = urlObj.searchParams.get('qr');
    console.log('Extracted QR param from URL:', qrParam);
    return qrParam;
  } catch (error) {
    console.error('Error extracting QR code from URL:', error);
    return null;
  }
};

// Debug utility to check if a QR code exists in the database
export const debugVerifyQRCodeInDatabase = async (encryptedData: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  if (!encryptedData) return { exists: false, message: 'No encrypted data provided' };
  
  try {
    console.log('Debug: Checking database for QR code:', encryptedData);
    // Log all records for debugging
    const { data: allQrCodes } = await supabase
      .from('qr_codes')
      .select('encrypted_data')
      .limit(10);
    
    console.log('Debug: First 10 QR codes in database:', allQrCodes);
    
    const { data, error, count } = await supabase
      .from('qr_codes')
      .select('*', { count: 'exact' })
      .eq('encrypted_data', encryptedData);
    
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

// New utility to fetch a QR code directly by its ID
export const fetchQRCodeById = async (id: string) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching QR code by ID:', error);
      throw new Error(`Failed to fetch QR code: ${error.message}`);
    }
    
    return data ? {
      id: data.id,
      sequentialNumber: data.sequential_number,
      encryptedData: data.encrypted_data,
      url: data.url,
      isScanned: data.is_scanned,
      isEnabled: data.is_enabled,
      createdAt: data.created_at,
      scannedAt: data.scanned_at,
      dataUrl: data.data_url
    } : null;
  } catch (error) {
    console.error('Exception fetching QR code by ID:', error);
    throw error;
  }
};
