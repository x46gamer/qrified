
export interface QRCode {
  id: string;
  sequentialNumber: string;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  scannedAt?: string;
  dataUrl?: string;
  
  // Template settings
  template?: 'classic' | 'modern-blue' | 'modern-beige' | 'arabic';
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
}
