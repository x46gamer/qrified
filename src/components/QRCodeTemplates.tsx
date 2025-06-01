import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type TemplateType = 'classic' | 'classic1' | 'classic2' | 'classic3';

interface TemplateOption {
  id: TemplateType;
  name: string;
  // Removed bgColor, textColor as styles will be more complex
  // imageUrl?: string; // Removed as we won't have a simple preview image
}

interface QRCodeTemplatesProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

const templates: TemplateOption[] = [
  {
    id: 'classic',
    name: 'Original Product',
  },
  {
    id: 'classic1',
    name: 'Original Product1',
  },
  {
    id: 'classic2',
    name: 'Original Product2',
  },
  {
    id: 'classic3',
    name: 'Original Product3',
  },
];

const QRCodeTemplates: React.FC<QRCodeTemplatesProps> = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Choose QR Code Template</h3>
      <RadioGroup 
        value={selectedTemplate} 
        onValueChange={(value) => onSelectTemplate(value as TemplateType)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`template-${template.id}`}
              className="cursor-pointer"
            >
              <Card className={`overflow-hidden ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}>
                <CardContent className="p-2 flex items-center justify-center">
                  {/* Simplified preview representation */}
                  <div className="h-40 w-40 flex items-center justify-center rounded-sm border">
                    <span className="text-sm font-medium text-center">{template.name} Preview</span>
                    </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QRCodeTemplates;
