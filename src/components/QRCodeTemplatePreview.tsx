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
    // Base styles shared by all templates
    const baseStyles = {
      containerClass: 'flex flex-col items-center text-black font-sans overflow-hidden rounded-lg shadow-md w-[250px] h-[400px]',
      headerSectionClass: 'w-full bg-gray-400 text-black text-center pt-3 px-2 text-xl font-bold uppercase',
      middleSectionClass: 'flex flex-col items-center bg-gray-400 w-full pb-4 px-2',
      instructionClass: 'text-sm text-center mt-1 px-1 font-bold',
      websiteClass: 'w-full bg-black text-white text-center text-sm font-bold py-1 break-all',
      bottomSectionClass: 'w-full text-white text-center text-xs py-1 flex flex-col items-center',
      footerTextClass: 'font-bold',
      thankYouTextClass: 'text-xs',
    };

    switch (template) {
      case 'classic':
        return {
          ...baseStyles,
          bottomSectionClass: baseStyles.bottomSectionClass + ' bg-green-700',
        };
      case 'modern-blue':
        return {
          ...baseStyles,
          headerSectionClass: baseStyles.headerSectionClass.replace('bg-gray-400', 'bg-blue-600'),
          middleSectionClass: baseStyles.middleSectionClass.replace('bg-gray-400', 'bg-blue-100'),
          bottomSectionClass: baseStyles.bottomSectionClass + ' bg-blue-700',
        };
      case 'modern-beige':
        return {
          ...baseStyles,
          headerSectionClass: baseStyles.headerSectionClass.replace('bg-gray-400', 'bg-amber-700'),
          middleSectionClass: baseStyles.middleSectionClass.replace('bg-gray-400', 'bg-amber-50'),
          bottomSectionClass: baseStyles.bottomSectionClass + ' bg-amber-700',
        };
      case 'arabic':
        return {
          ...baseStyles,
          headerSectionClass: baseStyles.headerSectionClass.replace('bg-gray-400', 'bg-emerald-700'),
          middleSectionClass: baseStyles.middleSectionClass.replace('bg-gray-400', 'bg-emerald-50'),
          bottomSectionClass: baseStyles.bottomSectionClass + ' bg-emerald-700',
        };
      default:
        return {
          ...baseStyles,
          bottomSectionClass: baseStyles.bottomSectionClass + ' bg-green-700',
        };
    }
  };

  const styles = getTemplateStyles();
  
  return (
    <div className={`w-full max-w-xs mx-auto ${styles.containerClass} ${directionRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Top Section: PRODUCT AUTHENTICATION */}
      <div className={styles.headerSectionClass}>
        {headerText || 'PRODUCT AUTHENTICATION'}
          </div>
        
      {/* Middle Section: QR Code, Instruction Text */}
      <div className={`${styles.middleSectionClass} flex-grow`}>
        {qrCodeDataUrl && (
          <div className="relative w-full h-auto flex justify-center items-center">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code" 
              className="w-full h-auto max-w-[300px]"
              onError={(e) => {
                console.error("Error loading QR code image");
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPlFSIENvZGUgRXJyb3I8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>
        )}
        
        {instructionText && (
          <div className={`${styles.instructionClass}`}>
            {instructionText || 'Scan this QR code to verify the\nauthenticity of your product'}
          </div>
        )}
      </div>
        
      {/* Website URL Section (Black band) - Conditionally displayed */}
        {websiteUrl && (
        <div className={styles.websiteClass}>
            {websiteUrl}
          </div>
        )}
        
      {/* Bottom Section: VOID IF REMOVED ! and Thank You */}
      <div className={styles.bottomSectionClass}>
        <div className={styles.footerTextClass}>
            {'VOID IF REMOVED !'}
        </div>
        <div className={styles.thankYouTextClass}>
            {footerText || 'THANK YOU FOR CHOOSING OUR PRODUCT'}
          </div>
      </div>

    </div>
  );
};

// Default export for backward compatibility
export default QRCodeTemplatePreview;
