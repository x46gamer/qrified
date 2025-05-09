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
}
