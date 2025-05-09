
import { TemplateType } from '@/components/QRCodeTemplates';

export function isTemplateType(value: string): value is TemplateType {
  return ['classic', 'modern-blue', 'modern-beige', 'arabic'].includes(value);
}
