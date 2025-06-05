import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { UserLimits } from '@/types/userLimits';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signUpEmployee: (email: string, password: string, token: string) => Promise<void>;
  userLimits: UserLimits | null;
  refreshUserLimits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('qrauth_user');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user limits function (moved outside useEffect)
  const fetchUserLimits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_limits')
        .select('id, qr_limit, qr_created, qr_successful, monthly_qr_limit, monthly_qr_created, last_monthly_reset, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user limits:', error.message);
        setUserLimits(null);
        return;
      }

      if (data) {
        setUserLimits(data as unknown as UserLimits);
      } else {
        console.log('No user limits data found for user:', userId);
        setUserLimits({
          id: userId,
          qr_limit: 0,
          qr_created: 0,
          qr_successful: 0,
          monthly_qr_limit: 0,
          monthly_qr_created: 0,
          last_monthly_reset: new Date(0).toISOString(),
          created_at: new Date(0).toISOString(),
          updated_at: new Date(0).toISOString(),
        });
      }

    } catch (err) {
      console.error('Error in fetch user limits:', err);
      setUserLimits(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            role: 'admin', // Default role, should be fetched from profiles
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
          };
          setUser(userData);
          localStorage.setItem('qrauth_user', JSON.stringify(userData));
          
          // Fetch user profile to get role and user limits
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchUserLimits(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setUserLimits(null);
          localStorage.removeItem('qrauth_user');
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            role: 'admin', // Default role, should be fetched from profiles
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
          };
          setUser(userData);
          localStorage.setItem('qrauth_user', JSON.stringify(userData));
          
          // Fetch user profile to get role and user limits
          fetchUserProfile(session.user.id);
          fetchUserLimits(session.user.id);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };

    // Fetch user profile to get role
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        if (data) {
          setUser(prev => {
            if (!prev) return null;
            const updatedUser = {
              ...prev,
              role: data.role as UserRole
            };
            localStorage.setItem('qrauth_user', JSON.stringify(updatedUser));
            return updatedUser;
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [session?.user?.id]); // Depend on session user ID

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      setUser(null);
      toast.success('Logged out successfully');
      
      // Force page reload for a clean state
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset link');
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });
      
      if (error) throw error;
      
      toast.success('Signup successful! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Expose fetchUserLimits as refreshUserLimits
  const refreshUserLimits = async () => {
    if (user?.id) {
      await fetchUserLimits(user.id);
    }
  };

  // New function for employee signup via invitation
  const signUpEmployee = async (email: string, password: string, token: string) => {
    setIsLoading(true);
    cleanupAuthState(); // Clean up any existing session
    setError(null); // Clear previous errors (assuming setError is available in AuthContext or handle errors locally)

    try {
      // 1. Verify the invitation token again on the server side (optional but recommended for security)
      // For simplicity here, we rely on the client-side check in EmployeeSignup page first.
      // A more secure approach would be to have a Supabase Edge Function that verifies token and signs up.
      // As a compromise for this example, we'll just use the provided email/password with Supabase auth
      // and trust the client-side page verified the token and email.

      // 2. Create the user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
           // Optionally add user metadata like name if collected on employee signup page
          // data: { name: employeeName },
          // Consider if email confirmation is needed here - invitation link might bypass it.
          // disable_email_confirmation: true, // Use this if invitation link confirms email
        }
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        throw new Error(signUpError.message || 'Failed to create user account.');
      }

      if (!data?.user) {
         throw new Error('User data not returned after signup.');
      }

      const newUser = data.user;
      console.log('New user created in auth.users:', newUser);

      // 3. Update the user_profiles table to set the role to 'employee'
      // Note: The handle_new_user_profile trigger might run first and set role to 'admin'.
      // We are explicitly updating it here to ensure it's 'employee'.
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ role: 'employee' })
        .eq('id', newUser.id);

      if (profileError) {
        console.error('Error updating user profile role:', profileError);
        // Depending on criticality, you might want to log this and alert admin, but still let user log in.
        // For now, we'll let it proceed but log the error.
        toast.warning('Account created, but failed to set employee role automatically.');
      }
      
      // 4. Mark the invitation as accepted
      const { error: inviteUpdateError } = await supabase
         .from('user_invites')
         .update({ accepted_at: new Date().toISOString(), accepted_user_id: newUser.id })
         .eq('token', token)
         .is('accepted_at', null); // Ensure we only update if it hasn't been accepted yet

      if (inviteUpdateError) {
          console.error('Error marking invitation as accepted:', inviteUpdateError);
          // This is less critical, log and continue.
      }

      // 5. Optional: Redirect after successful signup/role assignment - REMOVE NAVIGATION HERE
      toast.success('Employee account created successfully!');
      // Redirect to dashboard or a welcome page
      // navigate('/dashboard'); // REMOVE THIS LINE

      // Return success or user data to the calling component
      return { success: true, user: newUser };

    } catch (error: any) {
      console.error('Error in signUpEmployee:', error);
      // Do not show toast here, let the component handle the error toast after catching
      throw error; // Re-throw to be caught by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        signUp,
        signUpEmployee,
        userLimits,
        refreshUserLimits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
