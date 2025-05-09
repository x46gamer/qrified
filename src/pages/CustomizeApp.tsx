
import React from 'react';
import { AppearanceSettings } from '@/components/AppearanceSettings';

const CustomizeApp = () => {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">App Customization</h1>
      
      <div className="space-y-8">
        <AppearanceSettings />
      </div>
    </div>
  );
};

export default CustomizeApp;
