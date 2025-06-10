import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Import supabase
import { UserLimits } from '@/types/userLimits'; // Import UserLimits type
import { UserProfile } from '@/types/user';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee' | null;
}

// List of routes that should be accessible even after trial expiration (expired trial users can only access /plans and /logout)
const ALLOWED_AFTER_TRIAL_EXPIRATION = [
  '/plans',
  '/logout',
];

// List of routes that are allowed for users whose trial is not started (so they can activate their trial)
const ALLOWED_IF_TRIAL_NOT_STARTED = [
  '/freetrial',
  '/login',
  '/signup',
];

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isLoading, userProfile, forceRefreshProfile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Force refresh profile on mount or user change to get latest trial status
    if (user?.id) {
      forceRefreshProfile();
    }
  }, [user?.id, forceRefreshProfile]);

  if (isLoading || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    if (!['/login', '/signup'].includes(location.pathname)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>; 
  }

  // If a specific role is required and the user doesn't have it, redirect to unauthorized
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // CRITICAL: If trial is active and user tries to access /freetrial, redirect them to stats
  if (userProfile.trial_status === 'active' && location.pathname === '/freetrial') {
    return <Navigate to="/stats" replace />;
  }

  // If trial is not started and user tries to access a non-allowed route, redirect to /freetrial
  if (userProfile.trial_status === 'not_started' && !ALLOWED_IF_TRIAL_NOT_STARTED.includes(location.pathname)) {
    toast.error('Please activate your free trial to access the app.');
    return <Navigate to="/freetrial" replace />;
  }

  // If trial has expired and user tries to access a non-allowed route, redirect to /plans
  if (userProfile.trial_status === 'expired' && !ALLOWED_AFTER_TRIAL_EXPIRATION.includes(location.pathname)) {
    toast.error('Your trial period has ended. Please choose a plan to continue using the app.');
    return <Navigate to="/plans" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
