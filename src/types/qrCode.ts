
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
  userId: string;
  data: QRCodeData;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional properties that are used in the application
  sequentialNumber?: string | number;
  encryptedData?: string;
  isScanned?: boolean;
  isEnabled?: boolean;
  scannedAt?: Date | string;
  dataUrl?: string;
  template?: TemplateType;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
}
