
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'crypto';

// Secret key for encryption
const SECRET_KEY = 'qrcode-secret-key';

// Generate a proper UUID for QR code
export const generateUniqueId = (): string => {
  return uuidv4();
};

// Encrypt the QR code data
export const encryptData = (data: string): string => {
  const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return encodeURIComponent(encrypted);
};

// Decrypt the QR code data
export const decryptData = (encryptedData: string): string => {
  const decoded = decodeURIComponent(encryptedData);
  const decrypted = CryptoJS.AES.decrypt(decoded, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return decrypted;
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
