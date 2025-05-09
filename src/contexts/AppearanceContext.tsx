import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

interface AppearanceContextType {
  appearance: AppearanceSettings;
  setAppearance: (settings: AppearanceSettings) => void;
}

interface AppearanceProviderProps {
  children: React.ReactNode;
}

const defaultAppearanceSettings: AppearanceSettings = {
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  logoUrl: 'https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1fbd5402-f9f9-49b4-90f0-38d70c7dd216.png',
};

export const AppearanceContext = createContext<AppearanceContextType>({
  appearance: defaultAppearanceSettings,
  setAppearance: () => {},
});

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearanceSettings);

  useEffect(() => {
    getStoredSettings();
  }, []);

  const getStoredSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'appearance')
        .single();

      if (error) {
        console.error('Error fetching appearance settings:', error);
        setAppearance(defaultAppearanceSettings);
        return;
      }

      if (data?.value) {
        // Add type assertion to handle the conversion safely
        setAppearance(data.value as AppearanceSettings);
      } else {
        setAppearance(defaultAppearanceSettings);
      }
    } catch (error) {
      console.error('Error fetching appearance settings:', error);
      setAppearance(defaultAppearanceSettings);
    }
  };

  const updateAppearance = (settings: AppearanceSettings) => {
    setAppearance(settings);
  };

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance: updateAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => useContext(AppearanceContext);
