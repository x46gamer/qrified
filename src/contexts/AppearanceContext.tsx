
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppearanceSettings {
  successBackground: string;
  successText: string;
  successIcon: string;
  failureBackground: string;
  failureText: string;
  failureIcon: string;
  successTitle: string;
  successDescription: string;
  successFooterText: string;
  failureTitle: string;
  failureDescription: string;
  failureFooterText: string;
  isRtl: boolean;
  enableReviews: boolean;
  enableFeedback: boolean;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  successBackground: '#f0fdf4',
  successText: '#16a34a',
  successIcon: '#22c55e',
  failureBackground: '#fef2f2',
  failureText: '#dc2626',
  failureIcon: '#ef4444',
  successTitle: 'Product Verified',
  successDescription: 'This product is legitimate and original. Thank you for checking its authenticity.',
  successFooterText: 'This QR code has been marked as used and cannot be verified again.',
  failureTitle: 'Not Authentic',
  failureDescription: 'This product could not be verified as authentic. It may be counterfeit or has been previously verified.',
  failureFooterText: 'If you believe this is an error, please contact the product manufacturer.',
  isRtl: false,
  enableReviews: true,
  enableFeedback: true,
  logoUrl: null,
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6'
};

interface AppearanceContextType extends AppearanceSettings {
  updateSettings: (settings: Partial<AppearanceSettings>) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const AppearanceSettingsContext = createContext<AppearanceContextType>({
  ...DEFAULT_SETTINGS,
  updateSettings: async () => {},
  isLoading: false,
  isSaving: false
});

export const AppearanceSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'theme')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows" error
          console.error('Error fetching appearance settings:', error);
          toast.error('Failed to load appearance settings');
          return;
        }

        if (data?.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data.settings
          });
        }
      } catch (err) {
        console.error('Error in loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppearanceSettings>) => {
    try {
      setIsSaving(true);
      const updatedSettings = {
        ...settings,
        ...newSettings
      };

      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 'theme',
          settings: updatedSettings
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating settings:', error);
        toast.error('Failed to save appearance settings');
        return;
      }

      setSettings(updatedSettings);
      toast.success('Appearance settings saved successfully');
    } catch (err) {
      console.error('Error in updating settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppearanceSettingsContext.Provider
      value={{
        ...settings,
        updateSettings,
        isLoading,
        isSaving
      }}
    >
      {children}
    </AppearanceSettingsContext.Provider>
  );
};

export const useAppearanceSettings = () => useContext(AppearanceSettingsContext);
