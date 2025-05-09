
export interface QRCodeData {
  text: string;
  template: TemplateType;
  productName?: string;
  productId?: string;
  description?: string;
  uniqueId: string;
  logo?: string;
  foregroundColor?: string;
  backgroundColor?: string;
}

// Make sure TemplateType is exported
export type TemplateType = 'classic' | 'modern' | 'minimal' | 'business' | 'arabic' | 'modern-blue' | 'modern-beige';

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
  data?: QRCodeData;  // Add data field to match how it's used in Index.tsx
}
