export interface UserLimits {
  id: string;
  qr_limit: number; // All-time limit (if applicable, though not explicitly used as a hard limit currently)
  qr_created: number; // All-time count
  qr_successful: number; // All-time successful scans
  monthly_qr_limit: number; // Monthly limit
  monthly_qr_created: number; // Monthly count
  last_monthly_reset: string; // Timestamp of the last monthly reset (ISO string)
  created_at: string;
  updated_at: string;
} 