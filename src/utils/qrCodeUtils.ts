
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

// Secret key for encryption
const SECRET_KEY = 'qrcode-secret-key';

// Generate a unique string for QR code
export const generateUniqueId = (): string => {
  const timestamp = new Date().getTime().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
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
