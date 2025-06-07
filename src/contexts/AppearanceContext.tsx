import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export interface AppearanceSettings {
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
  headerText: string;
  footerText: string;
  instructionText: string;
  reviewButtonText: string;
  feedbackButtonText: string;
}

export const DEFAULT_SETTINGS: AppearanceSettings = {
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
  secondaryColor: '#8b5cf6',
  headerText: 'Product Authentication',
  footerText: 'Thank you for choosing our product',
  instructionText: 'Scan this QR code to verify the authenticity of your product',
  reviewButtonText: 'Leave a Review',
  feedbackButtonText: 'Give Feedback'
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
  const { user } = useAuth();

  useEffect(() => {
    async function loadSettings() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          toast.error('Failed to load appearance settings');
          setIsLoading(false);
          return;
        }

        if (data?.settings) {
          const storedSettings = data.settings as unknown;
          const typedSettings = storedSettings as AppearanceSettings;
          
          setSettings({
            ...DEFAULT_SETTINGS,
            ...typedSettings
          });
        } else {
          const { error: insertError } = await supabase
            .from('app_settings')
            .upsert({
              id: user.id,
              settings: DEFAULT_SETTINGS as unknown as Json
            }, {
              onConflict: 'id'
            });
            
            if (insertError) {
            } else {
              setSettings(DEFAULT_SETTINGS);
            }
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
    loadSettings();
    }
  }, [user]);

  const updateSettings = async (newSettings: Partial<AppearanceSettings>) => {
    try {
      setIsSaving(true);
      
      if (!user) {
        toast.error('You must be logged in to save settings');
        setIsSaving(false);
        return;
      }
      
      const updatedSettings = {
        ...settings,
        ...newSettings
      };

      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: user.id,
          settings: updatedSettings as unknown as Json
        }, {
          onConflict: 'id'
        });

      if (error) {
        toast.error('Failed to save appearance settings');
        return;
      }

      setSettings(updatedSettings);
      toast.success('Appearance settings saved successfully');
      
      localStorage.setItem('appearance_updated', Date.now().toString());
    } catch (err) {
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
