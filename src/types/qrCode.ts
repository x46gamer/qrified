
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
  sequentialNumber: string;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  scannedAt?: string;
  dataUrl: string;
  template?: TemplateType;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
}

// Add QRCodeTemplatePreviewProps interface to match component prop types
export interface QRCodeTemplatePreviewProps {
  template: TemplateType;
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  text?: string; // Added text prop instead of value
}
