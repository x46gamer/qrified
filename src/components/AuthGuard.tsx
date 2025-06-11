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

// List of routes that should be accessible even after trial expiration
const ALLOWED_AFTER_TRIAL_EXPIRATION = [
  '/plans',
  '/logout',
  '/lifetime',
];

// List of routes that are allowed for users whose trial is not started
const ALLOWED_IF_TRIAL_NOT_STARTED = [
  '/login',
  '/signup',
  '/lifetime',
];

// List of routes that are always allowed for authenticated users
const ALWAYS_ALLOWED_ROUTES = [
  '/logout',
  '/lifetime',
  '/login',
  '/signup',
];

// List of routes that require an active subscription
const SUBSCRIPTION_REQUIRED_ROUTES = [
  '/stats',
  '/dashboard',
  '/settings',
  '/domain-settings',
  '/myaccount',
  '/feedback',
  '/scanlogs',
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

  // Handle unauthenticated users
  if (!user) {
    // Store the intended destination (lifetime page) in the state
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      return <Navigate to="/login" state={{ from: '/lifetime' }} replace />;
    }
    return <>{children}</>;
  }

  // If a specific role is required and the user doesn't have it, redirect to unauthorized
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if the route requires a subscription
  if (SUBSCRIPTION_REQUIRED_ROUTES.includes(location.pathname)) {
    // Allow access if user has an active lifetime subscription
    if (userProfile.subscription_type === 'lifetime' && userProfile.subscription_status === 'active') {
      return <>{children}</>;
    }
    
    // Redirect to lifetime page if no active subscription
    toast.info('Please purchase a lifetime subscription to access this feature.');
    return <Navigate to="/lifetime" replace />;
  }

  // TEMPORARY: During lifetime deal, redirect all non-allowed routes to lifetime page
  if (!ALWAYS_ALLOWED_ROUTES.includes(location.pathname) && 
      !SUBSCRIPTION_REQUIRED_ROUTES.includes(location.pathname)) {
    return <Navigate to="/lifetime" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
