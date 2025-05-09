
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the hash fragment from the URL
      const hash = window.location.hash;

      try {
        if (hash) {
          // Process the authentication callback
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error("Error in auth callback:", error);
            throw error;
          }
          
          if (data?.user) {
            // Success - redirect to dashboard
            navigate('/dashboard');
          } else {
            // No user - redirect to login
            navigate('/login');
          }
        } else {
          // No hash - redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error("Error processing auth callback:", error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing login...</h2>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
