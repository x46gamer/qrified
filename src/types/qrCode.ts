
export interface QRCode {
  id: string;
  sequentialNumber: string;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  scannedAt?: string;
  dataUrl?: string; // Add this property for the image data URL
}
