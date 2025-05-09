
import { TemplateType } from '@/components/QRCodeTemplates';

export interface QRCode {
  id: string;
  sequentialNumber: string;
  encryptedData: string;
  url: string;
  isScanned: boolean;
  isEnabled: boolean;
  createdAt: string;
  scannedAt: string | null;
  dataUrl?: string;
  template?: TemplateType;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
}
