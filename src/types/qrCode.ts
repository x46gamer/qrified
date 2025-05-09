
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
  userId?: string;  // Made optional since it's not always provided
  data?: QRCodeData; // Made optional since it's not always used
  url: string;
  createdAt: string | Date; // Accept both string and Date
  updatedAt?: string | Date; // Made optional and accept both string and Date
  
  // Additional properties that are used in the application
  sequentialNumber?: string | number;
  encryptedData?: string;
  isScanned?: boolean;
  isEnabled?: boolean;
  scannedAt?: Date | string | null;
  dataUrl?: string;
  template?: TemplateType;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
}
