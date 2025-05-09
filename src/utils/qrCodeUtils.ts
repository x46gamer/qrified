
import QRCode from 'qrcode';

// Generate a unique ID
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Encrypt data (basic implementation, consider using a more secure method)
export function encryptData(data: string): string {
  return btoa(data);
}

// Decrypt data (basic implementation, consider using a more secure method)
export function decryptData(encryptedData: string): string {
  return atob(encryptedData);
}

// Format sequential number
export function formatSequentialNumber(number: number): string {
  return String(number).padStart(6, '0');
}

// Calculate scan rate percentage
export function calculateScanRate(totalQRCodes: number, scannedQRCodes: number): number {
  if (totalQRCodes === 0) return 0;
  return Math.round((scannedQRCodes / totalQRCodes) * 100);
}

// Generate a QR code as a data URL
export async function generateQRCode(text: string, options: any = {}): Promise<string> {
  // Default options - ensure black and white QR code
  const defaultOptions = {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 400,
    color: {
      dark: '#000000', // Black
      light: '#ffffff', // White
    }
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Use QRCode from qrcode library to generate a data URL
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, mergedOptions, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}
