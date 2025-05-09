
import React from 'react';
import { TemplateType } from '../types/qrCode';

interface QRCodeTemplatePreviewProps {
  template: TemplateType | string;
  qrCodeDataUrl: string;
  headerText: string;
  instructionText: string;
  websiteUrl: string;
  footerText: string;
  directionRTL: boolean;
}

const QRCodeTemplatePreview: React.FC<QRCodeTemplatePreviewProps> = ({
  template,
  qrCodeDataUrl,
  headerText,
  instructionText,
  websiteUrl,
  footerText,
  directionRTL
}) => {
  // Define template-specific styles
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern-blue':
        return {
          bgColor: 'bg-blue-100',
          headerClass: 'text-3xl font-bold uppercase mb-3',
          instructionClass: 'text-xl mb-2',
          websiteClass: 'font-medium mb-3',
          footerClass: 'bg-black text-white font-medium py-2 px-4 rounded-md mt-3',
          containerClass: 'p-6 rounded-lg'
        };
      case 'modern-beige':
        return {
          bgColor: 'bg-amber-50',
          headerClass: 'text-3xl font-bold uppercase mb-3',
          instructionClass: 'text-xl mb-2',
          websiteClass: 'font-medium mb-3',
          footerClass: 'bg-black text-white font-medium py-2 px-4 rounded-md mt-3',
          containerClass: 'p-6 rounded-lg'
        };
      case 'arabic':
        return {
          bgColor: 'bg-amber-50',
          headerClass: 'text-3xl font-bold mb-3',
          instructionClass: 'text-xl mb-2',
          websiteClass: 'font-medium mb-3',
          footerClass: 'bg-green-800 text-white font-medium py-2 px-4 rounded-md mt-3',
          containerClass: 'p-6 rounded-lg border-4 border-brown-600 rounded-xl'
        };
      case 'classic':
      default:
        return {
          bgColor: 'bg-white',
          headerClass: 'text-2xl font-bold mb-3',
          instructionClass: 'text-lg mb-2',
          websiteClass: 'font-normal mb-3',
          footerClass: 'bg-gray-800 text-white py-2 px-4 mt-3',
          containerClass: 'p-4'
        };
    }
  };

  // Get default texts for Arabic template
  const getDefaultArabicText = () => {
    if (template === 'arabic') {
      return {
        header: headerText || 'تحقق من المنتج',
        instruction: instructionText || 'امسح رمز QR للتحقق من صحة المنتج',
        website: websiteUrl,
        footer: footerText || 'شكراً لاختيارك منتجاتنا',
      };
    }
    
    return {
      header: headerText,
      instruction: instructionText,
      website: websiteUrl,
      footer: footerText,
    };
  };

  const styles = getTemplateStyles();
  const texts = getDefaultArabicText();
  
  // Force RTL for Arabic template
  const isRTL = template === 'arabic' ? true : directionRTL;
  
  return (
    <div className={`w-full ${styles.bgColor} ${styles.containerClass} ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
        {texts.header && (
          <div className={`text-center ${styles.headerClass}`}>
            {texts.header}
          </div>
        )}
        
        {qrCodeDataUrl && (
          <div className="w-full mb-3">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code" 
              className="w-full max-w-[240px] mx-auto" /* Increased from 200px to 240px (20% wider) */
            />
          </div>
        )}
        
        {texts.instruction && (
          <div className={`text-center ${styles.instructionClass}`}>
            {texts.instruction}
          </div>
        )}
        
        {texts.website && (
          <div className={`text-center ${styles.websiteClass} break-all`}>
            {texts.website}
          </div>
        )}
        
        {texts.footer && (
          <div className={`text-center w-full ${styles.footerClass}`}>
            {texts.footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeTemplatePreview;
