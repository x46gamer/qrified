
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid'; // Using browser-compatible uuid package

// Secret key for encryption
const SECRET_KEY = 'qrcode-secret-key';

// Generate a proper UUID for QR code
export const generateUniqueId = (): string => {
  return uuidv4();
};

// Encrypt the QR code data
export const encryptData = (data: string): string => {
  console.log('Encrypting data:', data);
  const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  const encoded = encodeURIComponent(encrypted);
  console.log('Encrypted and encoded data:', encoded);
  return encoded;
};

// Decrypt the QR code data
export const decryptData = (encryptedData: string): string => {
  try {
    console.log('Decrypting data:', encryptedData);
    const decoded = decodeURIComponent(encryptedData);
    const decrypted = CryptoJS.AES.decrypt(decoded, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    console.log('Decrypted data:', decrypted);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt QR code data');
  }
};

// Generate QR code as data URL
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Format a 6-digit number with leading zeros
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
    // Attempt to decode URI component to check if it's valid
    const decoded = decodeURIComponent(encryptedData);
    console.log('Validated encrypted data, decoded:', decoded);
    return decoded.length > 0;
  } catch (error) {
    console.error('Invalid encrypted data format:', error);
    return false;
  }
};

// Function to extract the "qr" parameter from a URL
export const extractQRCodeFromURL = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('qr');
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
    const { data, error, count } = await supabase
      .from('qr_codes')
      .select('*', { count: 'exact' })
      .eq('encrypted_data', encryptedData);
    
    if (error) {
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
