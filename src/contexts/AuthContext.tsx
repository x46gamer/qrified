import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { UserLimits } from '@/types/userLimits';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, avatarUrl?: string | null) => Promise<void>;
  userLimits: UserLimits | null;
  refreshUserLimits: () => Promise<void>;
  userProfile: UserProfile | null;
  updateUserProfileState: (profile: UserProfile) => void;
  forceRefreshProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const updateUserProfileState = (profile: UserProfile) => {
    setUserProfile(profile);
    // The role for the `user` object is managed separately and defaults to 'user'
    // or is set based on specific application logic/admin intervention.
  };

  // New function to force refresh user profile from DB
  const forceRefreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchUserProfile(user.id, user.email || '', user.name || '', user.avatar_url || null);
      if (profileData) {
        setUserProfile(profileData);
      }
    }
  };

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

  // Fetch user profile and ensure user's role is set correctly
  const fetchUserProfile = async (userId: string, userEmail: string, userName: string, avatarUrl: string | null): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, role, avatar_url') // Fetch all profile fields including 'role' and 'avatar_url'
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (data) {
        // Profile exists, update user context's User object with fetched role and avatar
        setUser(prev => {
          if (!prev) return null;
          const updatedUser: User = {
            ...prev,
            role: data.role || 'user', // Use fetched role or default to 'user'
            avatar_url: data.avatar_url || avatarUrl || null // Use fetched avatar, or passed avatar, or null
          };
          // Only update if there's a material change to avoid unnecessary re-renders
          if (JSON.stringify(updatedUser) !== JSON.stringify(prev)) {
          localStorage.setItem('qrauth_user', JSON.stringify(updatedUser));
          return updatedUser;
          }
          return prev; // No material change, return previous state
        });
        return data as UserProfile;
      } else {
        // If no profile found, create one and set default role and avatar for User object
        console.log('No user profile found, creating one for user:', userId);
        const { data: newProfile, error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: userEmail,
            full_name: userName,
            trial_status: 'not_started',
            role: 'admin', // Default role for newly created user profile
            avatar_url: avatarUrl // Set avatar URL from parameter
          })
          .select('*') // Select all columns for the newly created profile
          .single();

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return null;
        }
        
        if (newProfile) {
          setUser(prev => {
            if (!prev) return null;
            const updatedUser: User = {
              ...prev,
              role: newProfile.role || 'admin', // Default role for newly created user profile
              avatar_url: newProfile.avatar_url || null // Set avatar URL from newly created profile
            };
            localStorage.setItem('qrauth_user', JSON.stringify(updatedUser));
            return updatedUser;
          });
          return newProfile as UserProfile;
        }
      }
      return null; // Should not reach here if logic is sound
    } catch (error) {
      console.error('Error fetching or creating user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          const googleAvatarUrl = userMetadata?.picture || null; // Google provides 'picture' for avatar
          // Only set basic user data here. Role and avatar will be fetched by processAuthUser.
          const userData: User = {
            id: session.user.id,
            role: 'admin', // Default to 'admin' for new users
            name: userMetadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar_url: googleAvatarUrl, // Set initial avatar from Google metadata
          };
          setUser(userData);
          localStorage.setItem('qrauth_user', JSON.stringify(userData));
          
          const processAuthUser = async () => {
            // Fetch user profile to get the actual role and avatar from the database
            const profileData = await fetchUserProfile(session.user.id, session.user.email || '', userMetadata.name || '', googleAvatarUrl);
            if (profileData) {
              setUserProfile(profileData);
              // The setUser inside fetchUserProfile will update the user object with the correct role and avatar
            }
            fetchUserLimits(session.user.id);
          };
          processAuthUser();

        } else {
          setUser(null);
          setUserLimits(null);
          setUserProfile(null);
          localStorage.removeItem('qrauth_user');
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          const googleAvatarUrl = userMetadata?.picture || null; // Google provides 'picture' for avatar
          // Only set basic user data here. Role and avatar will be fetched by fetchUserProfile.
          const userData: User = {
            id: session.user.id,
            role: 'admin', // Default to 'admin' for new users
            name: userMetadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar_url: googleAvatarUrl, // Set initial avatar from Google metadata
          };
          setUser(userData);
          localStorage.setItem('qrauth_user', JSON.stringify(userData));
          
          const profileData = await fetchUserProfile(session.user.id, session.user.email || '', userMetadata.name || '', googleAvatarUrl);
          if (profileData) {
            setUserProfile(profileData);
            // The setUser inside fetchUserProfile will update the user object with the correct role and avatar
          }
          fetchUserLimits(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
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
  }, [session?.user?.id]);

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

      if (data.user) {
        const profileData = await fetchUserProfile(data.user.id, data.user.email || '', data.user.user_metadata.name || '', data.user.user_metadata.picture || null);
        if (profileData) {
          setUserProfile(profileData);
        }
      }
      
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
          redirectTo: window.location.origin + '/lifetime'
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setIsLoading(false);
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
      setUserProfile(null);
      toast.success('Logged out successfully');
      
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) throw error;
      toast.success('Password reset email sent. Check your inbox!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, name: string, avatarUrl: string | null = null) => {
    try {
      setIsLoading(true);
      cleanupAuthState();

      // First, sign up the user
      const { data: { user: newUser, session }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            avatar_url: avatarUrl
          },
        },
      });

      if (error) throw error;

      if (newUser) {
        // Wait for a short moment to ensure the session is established
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          throw new Error('Failed to establish session after signup');
        }

        // Now create the profile with the established session
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: newUser.id,
            email: newUser.email,
            full_name: name,
            trial_status: 'not_started',
            role: 'admin'
          });

        if (profileError) {
          console.error('Error creating user profile on signup:', profileError);
          toast.error('Failed to create user profile.');
          throw profileError;
        }
        
        const createdProfile: UserProfile = {
          id: newUser.id,
          email: newUser.email || '',
          full_name: name,
          trial_status: 'not_started',
          avatar_url: avatarUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          trial_started_at: null,
          trial_ended_at: null,
          role: 'admin',
          subscription_type: 'none',
          subscription_status: 'inactive',
          subscription_started_at: null,
          subscription_ends_at: null,
          stripe_customer_id: null,
          stripe_subscription_id: null
        };
        setUserProfile(createdProfile);
        setUser(prev => {
          if (!prev) return null;
          return { ...prev, role: 'admin' };
        });

        toast.success('Sign up successful! Please check your email to confirm your account.');
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserLimits = async () => {
    if (user?.id) {
      await fetchUserLimits(user.id);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        signUp,
        userLimits,
        refreshUserLimits,
        userProfile,
        updateUserProfileState,
        forceRefreshProfile,
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
