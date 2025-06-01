import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Import supabase
import { UserLimits } from '@/types/userLimits'; // Import UserLimits type

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee' | null;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [hasFetchedPlan, setHasFetchedPlan] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false); // State to track active plan
  const location = useLocation();

  // Routes that do NOT require an active plan (e.g., subscribe page)
  const publicPlanRoutes = ['/subscribe']; 

  useEffect(() => {
    const checkPlan = async () => {
      if (!user) {
        setHasFetchedPlan(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_limits')
          .select('monthly_qr_limit') // Fetch monthly_qr_limit to check for a plan
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user plan:', error);
          // Assume no active plan on error for safety
          setHasActivePlan(false);
        } else if (data) {
          // Consider having an active plan if monthly_qr_limit is greater than a free tier limit (e.g., 0)
          // You might need a more sophisticated check based on your plan structure
          setHasActivePlan((data as any).monthly_qr_limit > 0); // Example check
        } else {
           // No user_limits entry found, assume no active plan
           setHasActivePlan(false);
        }
      } catch (err) {
        console.error('Error in checkPlan:', err);
        setHasActivePlan(false);
      } finally {
        setHasFetchedPlan(true);
      }
    };

    if (isAuthenticated && !hasFetchedPlan && user) {
      checkPlan();
    } else if (!isAuthenticated) {
       setHasFetchedPlan(true); // If not authenticated, no plan to fetch
    }

  }, [isAuthenticated, user, hasFetchedPlan]);

  if (isLoading || (isAuthenticated && !hasFetchedPlan)) {
    // Show loading indicator while authentication status or plan status is being checked
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, check if the current route requires a plan
  const requiresPlan = !publicPlanRoutes.includes(location.pathname);

  // If the route requires a plan and the user doesn't have one, redirect to subscribe
  if (requiresPlan && !hasActivePlan) {
     // Prevent infinite redirect if already on subscribe page
     if (location.pathname !== '/subscribe') {
       return <Navigate to="/subscribe" replace />;
     }
  }

  // If a specific role is required and the user doesn't have it, redirect to home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, has an active plan (or route doesn't require one), and meets role requirements, render children
  return <>{children}</>;
};

export default AuthGuard;
