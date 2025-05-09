
import React from 'react';
import { TemplateType } from './QRCodeTemplates';

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
          headerClass: 'text-3xl font-bold uppercase mb-2',
          instructionClass: 'text-xl mb-1',
          websiteClass: 'font-medium mb-2',
          footerClass: 'bg-black text-white font-medium py-2 px-4 rounded-md mt-2',
          containerClass: 'p-6 rounded-lg'
        };
      case 'modern-beige':
        return {
          bgColor: 'bg-amber-50',
          headerClass: 'text-3xl font-bold uppercase mb-2',
          instructionClass: 'text-xl mb-1',
          websiteClass: 'font-medium mb-2',
          footerClass: 'bg-black text-white font-medium py-2 px-4 rounded-md mt-2',
          containerClass: 'p-6 rounded-lg'
        };
      case 'arabic':
        return {
          bgColor: 'bg-amber-50',
          headerClass: 'text-3xl font-bold mb-2',
          instructionClass: 'text-xl mb-1',
          websiteClass: 'font-medium mb-2',
          footerClass: 'bg-green-800 text-white font-medium py-2 px-4 rounded-md mt-2',
          containerClass: 'p-6 rounded-lg border-4 border-brown-600 rounded-xl'
        };
      case 'classic':
      default:
        return {
          bgColor: 'bg-white',
          headerClass: 'text-2xl font-bold mb-2',
          instructionClass: 'text-lg mb-1',
          websiteClass: 'font-normal mb-2',
          footerClass: 'bg-gray-800 text-white py-2 px-4 mt-2',
          containerClass: 'p-4'
        };
    }
  };

  const styles = getTemplateStyles();
  
  return (
    <div className={`w-full ${styles.bgColor} ${styles.containerClass} ${directionRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
        {headerText && (
          <div className={`text-center ${styles.headerClass}`}>
            {headerText}
          </div>
        )}
        
        {qrCodeDataUrl && (
          <div className="w-full mb-2">
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
