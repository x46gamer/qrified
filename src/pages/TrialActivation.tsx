import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/user';

const TrialActivation = () => {
  const { user, isLoading, userProfile, updateUserProfileState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If userProfile is loaded and trial is active, redirect to main app immediately.
    // AuthGuard also handles this, but this ensures instant redirect if user lands directly here.
    if (userProfile && userProfile.trial_status === 'active') {
      window.location.href = 'http://localhost:8080/stats'; // Absolute redirect to main app
      return;
    } else if (userProfile && userProfile.trial_status === 'expired') {
      navigate('/plans'); // Use navigate for internal app paths
      return;
    }

  }, [user, userProfile, navigate, updateUserProfileState]);

  const startTrial = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          trial_started_at: new Date().toISOString(),
          trial_status: 'active'
        })
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        updateUserProfileState(data as UserProfile);
        toast.success('Free trial activated! Enjoy your 14-day trial period.');
        // Final, unconditional redirect to the main app using absolute URL
        window.location.href = 'http://localhost:8080/stats'; 
      }

    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error('Failed to activate trial');
    }
  };

  if (isLoading || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // This block was identified as redundant and potentially conflicting; it's now covered by useEffect above.
  // if (userProfile.trial_status === 'active') {
  //   window.location.href = 'http://localhost:8080/stats';
  //   return null;
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Start Your Free Trial</CardTitle>
          <CardDescription className="text-center">
            Activate your 14-day free trial to explore all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">What's included in your trial:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Unlimited QR code generation</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Custom branding</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <Button
            className="w-full"
            onClick={startTrial}
            disabled={userProfile.trial_status === 'expired' || isLoading}
          >
            {isLoading ? 'Loading...' : 'Start 14-Day Free Trial'}
          </Button>
          <p className="text-xs text-center text-gray-500">
            No credit card required. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialActivation; 