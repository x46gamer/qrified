
import React from 'react';
import { TemplateType } from '@/types/qrCode';

export interface QRCodeTemplatePreviewProps {
  template: TemplateType | string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  qrCodeDataUrl?: string;
  headerText?: string;
  instructionText?: string;
  websiteUrl?: string;
  footerText?: string;
  directionRTL?: boolean;
}

export const QRCodeTemplatePreview: React.FC<QRCodeTemplatePreviewProps> = ({
  template,
  primaryColor,
  secondaryColor,
  size,
  qrCodeDataUrl,
  headerText,
  instructionText,
  websiteUrl,
  footerText,
  directionRTL = false
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
          <div className="w-full mb-3 flex justify-center">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code" 
              className="w-full max-w-[200px] mx-auto object-contain"
              onError={(e) => {
                console.error("Error loading QR code image");
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPlFSIENvZGUgRXJyb3I8L3RleHQ+PC9zdmc+';
              }}
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

// Default export for backward compatibility
export default QRCodeTemplatePreview;
