
export interface QRCode {
  id: string;
  sequentialNumber: string;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  scannedAt?: string;
}
