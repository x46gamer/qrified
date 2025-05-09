
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TemplateType, templateLanguages } from '@/types/qrCode';

interface QRCodeTemplatesProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
  onTemplateContentChange?: (headerText: string, instructionText: string, footerText: string, directionRTL: boolean) => void;
}

const templates: { 
  id: TemplateType; 
  name: string; 
  bgColor: string; 
  textColor: string;
  imageUrl?: string;
}[] = [
  {
    id: 'english',
    name: 'English',
    bgColor: 'bg-white',
    textColor: 'text-black',
    imageUrl: '/lovable-uploads/2e0c5504-d6ed-42fc-adfc-0c237922171a.png'
  },
  {
    id: 'french',
    name: 'French',
    bgColor: 'bg-blue-100',
    textColor: 'text-black',
    imageUrl: '/lovable-uploads/be74d445-2cb2-40e6-92c9-ab17ae02540b.png'
  },
  {
    id: 'arabic',
    name: 'Arabic',
    bgColor: 'bg-amber-50',
    textColor: 'text-brown-800',
    imageUrl: '/lovable-uploads/5e2755bb-b112-4900-a768-141373638ba4.png'
  }
];

const QRCodeTemplates: React.FC<QRCodeTemplatesProps> = ({ 
  selectedTemplate, 
  onSelectTemplate,
  onTemplateContentChange
}) => {
  // Update template content when template changes
  React.useEffect(() => {
    if (onTemplateContentChange) {
      const content = templateLanguages[selectedTemplate];
      onTemplateContentChange(
        content.headerText,
        content.instructionText,
        content.footerText,
        content.directionRTL
      );
    }
  }, [selectedTemplate, onTemplateContentChange]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Choose QR Code Template</h3>
      <RadioGroup 
        value={selectedTemplate} 
        onValueChange={(value) => onSelectTemplate(value as TemplateType)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                <CardContent className="p-2">
                  {template.imageUrl ? (
                    <div className="h-40 relative">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="object-cover w-full h-full rounded-sm"
                      />
                    </div>
                  ) : (
                    <div className={`h-40 ${template.bgColor} flex items-center justify-center rounded-sm`}>
                      <span className={`${template.textColor} text-sm font-medium`}>{template.name}</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-center font-medium">{template.name}</div>
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
