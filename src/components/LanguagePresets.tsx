
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LanguagePresetsProps {
  onLoadPreset: (preset: 'english' | 'arabic') => void;
}

const LanguagePresets: React.FC<LanguagePresetsProps> = ({ onLoadPreset }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button 
            onClick={() => onLoadPreset('english')}
            variant="outline"
            className="flex-1"
          >
            EN - Load English Text
          </Button>
          <Button 
            onClick={() => onLoadPreset('arabic')}
            variant="outline"
            className="flex-1"
          >
            AR - Load Arabic Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagePresets;
