
import { supabase } from '@/integrations/supabase/client';

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  verification_token: string;
  created_at: string;
  verified_at: string | null;
}

export const domainService = {
  // Get all domains for the current user
  getUserDomains: async (): Promise<Domain[]> => {
    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  },
  
  // Add a new domain
  addDomain: async (domain: string): Promise<Domain> => {
    // Generate verification token (in a real app you'd use crypto.randomUUID() or similar)
    const verificationToken = Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await supabase
      .from('custom_domains')
      .insert({
        domain,
        verification_token: verificationToken
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Verify a domain
  verifyDomain: async (domainId: string): Promise<boolean> => {
    try {
      // In a real app, call the edge function to verify the domain
      const { data } = await supabase.functions.invoke('verify-domain', {
        body: { domainId }
      });
      
      return data?.verified || false;
    } catch (error) {
      console.error('Error verifying domain:', error);
      return false;
    }
  },
  
  // Delete a domain
  deleteDomain: async (domainId: string): Promise<void> => {
    const { error } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', domainId);
    
    if (error) {
      throw error;
    }
  }
};
