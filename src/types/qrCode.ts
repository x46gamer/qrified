export interface QRCodeData {
  text: string;
  template: TemplateType;
  logo?: string;
  foregroundColor?: string;
  backgroundColor?: string;
}

// Make sure TemplateType is exported
export type TemplateType = 'classic' | 'modern-blue' | 'modern-beige' | 'arabic';

export interface QRCode {
  id: string;
  sequential_number: string | number;
  encrypted_data: string;
  url: string;
  is_scanned: boolean;
  is_enabled: boolean;
  created_at: string;
  scanned_at?: string;
  data_url: string;
  template: TemplateType;
  header_text?: string;
  instruction_text?: string;
  website_url?: string;
  footer_text?: string;
  direction_rtl?: boolean;
  user_id?: string;
  scanned_ip?: string;
  scanned_isp?: string;
  scanned_location?: string;
  scanned_city?: string;
  scanned_country?: string;
  text?: string;
  product_id?: string;
  product?: {
    id: string;
    name: string;
  } | null;
  failed_scan_attempts?: number;
}
