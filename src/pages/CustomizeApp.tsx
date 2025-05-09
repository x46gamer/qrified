
import React from 'react';
import { AppearanceSettings } from '@/components/AppearanceSettings';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

const CustomizeApp = () => {
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">App Customization</h1>
        </div>
        <Link to="/admin/feedback">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Feedback
          </Button>
        </Link>
      </div>
      
      <div className="space-y-8">
        <AppearanceSettings />
      </div>
    </div>
  );
};

export default CustomizeApp;
