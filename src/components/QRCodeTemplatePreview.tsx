
import React from 'react';
import { TemplateType } from './QRCodeTemplates';

interface QRCodeTemplatePreviewProps {
  template: TemplateType;
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
          headerClass: 'text-3xl font-bold uppercase',
          instructionClass: 'text-xl',
          websiteClass: 'font-medium',
          footerClass: 'bg-black text-white font-medium py-2 px-4 rounded-md',
          containerClass: 'p-6 rounded-lg'
        };
      case 'modern-beige':
        return {
          bgColor: 'bg-amber-50',
          headerClass: 'text-3xl font-bold uppercase',
          instructionClass: 'text-xl',
          websiteClass: 'font-medium',
          footerClass: 'bg-black text-white font-medium py-2 px-4 rounded-md',
          containerClass: 'p-6 rounded-lg'
        };
      case 'arabic':
        return {
          bgColor: 'bg-amber-50',
          headerClass: 'text-3xl font-bold',
          instructionClass: 'text-xl',
          websiteClass: 'font-medium',
          footerClass: 'bg-green-800 text-white font-medium py-2 px-4 rounded-md',
          containerClass: 'p-6 rounded-lg border-4 border-brown-600 rounded-xl'
        };
      case 'classic':
      default:
        return {
          bgColor: 'bg-white',
          headerClass: 'text-2xl font-bold',
          instructionClass: 'text-lg',
          websiteClass: 'font-normal',
          footerClass: 'bg-gray-800 text-white py-2 px-4',
          containerClass: 'p-4'
        };
    }
  };

  const styles = getTemplateStyles();
  
  return (
    <div className={`w-full ${styles.bgColor} ${styles.containerClass} ${directionRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
        {headerText && (
          <div className={`text-center ${styles.headerClass}`}>
            {headerText}
          </div>
        )}
        
        {qrCodeDataUrl && (
          <div className="w-full">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code" 
              className="w-full max-w-[200px] mx-auto"
            />
          </div>
        )}
        
        {instructionText && (
          <div className={`text-center ${styles.instructionClass}`}>
            {instructionText}
          </div>
        )}
        
        {websiteUrl && (
          <div className={`text-center ${styles.websiteClass} break-all`}>
            {websiteUrl}
          </div>
        )}
        
        {footerText && (
          <div className={`text-center w-full ${styles.footerClass}`}>
            {footerText}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeTemplatePreview;
