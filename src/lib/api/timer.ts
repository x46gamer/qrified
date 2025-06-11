import { createClient } from '@supabase/supabase-js';

export interface TimerResponse {
  endDate: string;
  error?: string;
}

// Ensure these environment variables are set in your .env file with VITE_ prefix
// e.g., VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
// e.g., VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function getLifetimeTimer(): Promise<TimerResponse> {
  // It's good practice to ensure these are defined before using
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key are not defined in environment variables.');
    return {
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Fallback
      error: 'Supabase environment variables not configured.'
    };
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabase
      .rpc('get_lifetime_timer_end_date');

    if (error) throw error;

    return {
      endDate: data
    };
  } catch (error) {
    console.error('Error fetching lifetime timer:', error);
    return {
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Fallback to 7 days from now
      error: 'Failed to fetch timer'
    };
  }
} 