
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
    
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      domain: item.domain,
      status: item.status as 'pending' | 'verified' | 'failed',
      verification_token: item.verification_token,
      created_at: item.created_at,
      verified_at: item.verified_at
    }));
  },
  
  // Add a new domain
  addDomain: async (domain: string): Promise<Domain> => {
    // Generate verification token (in a real app you'd use crypto.randomUUID() or similar)
    const verificationToken = Math.random().toString(36).substring(2, 15);
    
    // Get current user to add user_id to the domain
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('custom_domains')
      .insert({
        domain,
        user_id: user.id,
        verification_token: verificationToken
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      user_id: data.user_id,
      domain: data.domain,
      status: data.status as 'pending' | 'verified' | 'failed',
      verification_token: data.verification_token,
      created_at: data.created_at,
      verified_at: data.verified_at
    };
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
