
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithRole: (role: UserRole) => void; // Keep demo login for testing
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          try {
            // Fetch user role from profile
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
              
            // Convert string role to UserRole type
            let userRole: UserRole = null;
            if (profileData?.role === 'admin' || profileData?.role === 'employee') {
              userRole = profileData.role;
            }
              
            const userData: User = {
              id: session.user.id,
              role: userRole,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
            };
            
            setUser(userData);
            localStorage.setItem('qrauth_user', JSON.stringify(userData));
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Set basic user info if profile fetch fails
            const userData: User = {
              id: session.user.id,
              role: 'employee', // Default role if we can't determine it
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
            };
            setUser(userData);
            localStorage.setItem('qrauth_user', JSON.stringify(userData));
          }
        } else {
          setUser(null);
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
          try {
            // Fetch user role from profile
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
              
            // Convert string role to UserRole type
            let userRole: UserRole = null;
            if (profileData?.role === 'admin' || profileData?.role === 'employee') {
              userRole = profileData.role;
            }
            
            const userData: User = {
              id: session.user.id,
              role: userRole,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
            };
            
            setUser(userData);
            localStorage.setItem('qrauth_user', JSON.stringify(userData));
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Set basic user info if profile fetch fails
            const userData: User = {
              id: session.user.id,
              role: 'employee', // Default role if we can't determine it
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
            };
            setUser(userData);
            localStorage.setItem('qrauth_user', JSON.stringify(userData));
          }
        } else {
          // Check if user is already logged in from localStorage (for demo login)
          const storedUser = localStorage.getItem('qrauth_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };

    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  // Keep the old login method for testing
  const loginWithRole = (role: UserRole) => {
    const newUser = {
      id: `user_${Date.now()}`,
      role: role,
      name: role === 'admin' ? 'Admin User' : 'Employee User',
      email: role === 'admin' ? 'admin@example.com' : 'employee@example.com',
    };
    setUser(newUser);
    localStorage.setItem('qrauth_user', JSON.stringify(newUser));
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithRole,
        logout,
        resetPassword,
        signUp,
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
