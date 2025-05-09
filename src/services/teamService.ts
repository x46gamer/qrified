
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  display_name: string;
  role: 'admin' | 'employee';
  created_at: string;
  updated_at: string;
}

export interface UserInvite {
  id: string;
  email: string;
  token: string;
  role: 'admin' | 'employee';
  permissions: {
    generate: boolean;
    manage: boolean;
    analytics: boolean;
  };
  invited_by: string;
  created_at: string;
  expires_at: string;
  accepted: boolean;
}

export const teamService = {
  // Get all team members
  getTeamMembers: async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  },
  
  // Get all pending invites
  getPendingInvites: async (): Promise<UserInvite[]> => {
    const { data, error } = await supabase
      .from('user_invites')
      .select('*')
      .eq('accepted', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  },
  
  // Send a new invite
  sendInvite: async (email: string, role: 'admin' | 'employee'): Promise<UserInvite> => {
    // Generate token
    const token = Math.random().toString(36).substring(2, 15);
    
    // Default permissions based on role
    const permissions = {
      generate: true,
      manage: role === 'admin',
      analytics: role === 'admin'
    };
    
    const { data, error } = await supabase
      .from('user_invites')
      .insert({
        email,
        token,
        role,
        permissions
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // In a real app, call an edge function to send the invite email
    try {
      await supabase.functions.invoke('send-invite', {
        body: { inviteId: data.id }
      });
    } catch (error) {
      console.error('Error sending invite email:', error);
    }
    
    return data;
  },
  
  // Resend an invitation
  resendInvite: async (inviteId: string): Promise<void> => {
    try {
      // Call the edge function to send the invite email
      await supabase.functions.invoke('send-invite', {
        body: { inviteId }
      });
    } catch (error) {
      console.error('Error resending invite:', error);
      throw error;
    }
  },
  
  // Delete an invitation
  deleteInvite: async (inviteId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_invites')
      .delete()
      .eq('id', inviteId);
    
    if (error) {
      throw error;
    }
  },
  
  // Update user role
  updateUserRole: async (userId: string, role: 'admin' | 'employee'): Promise<void> => {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
  }
};
