
export interface QRCodeData {
  text: string;
  template: TemplateType;
  logo?: string;
  foregroundColor?: string;
  backgroundColor?: string;
}

export type TemplateType = 'english' | 'french' | 'arabic';

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
}

export interface TemplateContent {
  headerText: string;
  instructionText: string;
  footerText: string;
  directionRTL: boolean;
}

export const templateLanguages: Record<TemplateType, TemplateContent> = {
  english: {
    headerText: "Product Authentication",
    instructionText: "Scan this QR code to verify the authenticity of your product",
    footerText: "Thank you for choosing our product",
    directionRTL: false
  },
  french: {
    headerText: "Authentification du Produit",
    instructionText: "Scannez ce code QR pour vérifier l'authenticité de votre produit",
    footerText: "Merci d'avoir choisi notre produit",
    directionRTL: false
  },
  arabic: {
    headerText: "توثيق المنتج",
    instructionText: "امسح رمز الاستجابة السريعة هذا للتحقق من أصالة منتجك",
    footerText: "شكرا لاختيارك منتجنا",
    directionRTL: true
  }
};
