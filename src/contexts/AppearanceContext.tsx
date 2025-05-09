
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

// Define the theme settings type
export type ThemeSettings = {
  // Color settings
  successBackground: string;
  successText: string;
  successIcon: string;
  failureBackground: string;
  failureText: string;
  failureIcon: string;
  
  // Text content
  successTitle: string;
  successDescription: string;
  successFooterText: string;
  failureTitle: string;
  failureDescription: string;
  failureFooterText: string;
  
  // Direction settings
  isRtl: boolean;
  
  // Feature toggles
  enableReviews: boolean;
  enableFeedback: boolean;
  
  // Logo
  logoUrl: string | null;
  
  // Brand colors for QR code templates
  primaryColor: string;
  secondaryColor: string;
};

export const defaultTheme: ThemeSettings = {
  // Default colors
  successBackground: "#f0fdf4", // green-50
  successText: "#16a34a", // green-600
  successIcon: "#22c55e", // green-500
  failureBackground: "#fef2f2", // red-50
  failureText: "#dc2626", // red-600
  failureIcon: "#ef4444", // red-500
  
  // Default text content
  successTitle: "Product Verified",
  successDescription: "This product is legitimate and original. Thank you for checking its authenticity.",
  successFooterText: "This QR code has been marked as used and cannot be verified again.",
  failureTitle: "Not Authentic",
  failureDescription: "This product could not be verified as authentic. It may be counterfeit or has been previously verified.",
  failureFooterText: "If you believe this is an error, please contact the product manufacturer.",
  
  // Default direction
  isRtl: false,
  
  // Default feature toggles
  enableReviews: false,
  enableFeedback: false,
  
  // Default logo
  logoUrl: null,
  
  // Default brand colors
  primaryColor: "#3b82f6", // blue-500
  secondaryColor: "#8b5cf6", // violet-500
};

interface AppearanceContextType extends ThemeSettings {
  setTheme: (newTheme: ThemeSettings) => void;
}

// Create the context
export const AppearanceSettingsContext = createContext<AppearanceContextType>({
  ...defaultTheme,
  setTheme: () => {}
});

// Create a provider component
export const AppearanceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // Explicitly type the query to app_settings table
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'theme')
          .maybeSingle();

        if (error) throw error;
        
        if (data && data.settings) {
          // Merge with default theme to ensure we have all required properties
          setThemeState({...defaultTheme, ...data.settings as ThemeSettings});
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        toast.error('Failed to load appearance settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const setTheme = async (newTheme: ThemeSettings) => {
    try {
      setThemeState(newTheme);
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 'theme',
          settings: newTheme,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success('Appearance settings updated successfully');
    } catch (error) {
      console.error('Error updating theme settings:', error);
      toast.error('Failed to update appearance settings');
    }
  };

  return (
    <AppearanceSettingsContext.Provider value={{
      ...theme,
      setTheme
    }}>
      {children}
    </AppearanceSettingsContext.Provider>
  );
};

// Create a custom hook to use the appearance settings
export const useAppearanceSettings = () => useContext(AppearanceSettingsContext);
