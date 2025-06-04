export interface QRCodeData {
  text: string;
  template: TemplateType;
  logo?: string;
  foregroundColor?: string;
  backgroundColor?: string;
}

// Make sure TemplateType is exported
export type TemplateType = 'classic' | 'modern-blue' | 'modern-beige' | 'arabic';

export interface QRCode {
  id: string;
  sequentialNumber: string | number;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  scannedAt?: string;
  dataUrl: string;
  template: TemplateType;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
  userId?: string; // Add user ID to track ownership
  scanned_ip?: string;
  scanned_isp?: string;
  scanned_location?: string; // Could be city, region, etc. depending on IP service
  scanned_city?: string;
  scanned_country?: string;
}
