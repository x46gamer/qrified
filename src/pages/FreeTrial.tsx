import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Zap, Shield, BarChart3 } from 'lucide-react';

const FreeTrial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const checkTrialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // If trial is already active or expired, redirect to appropriate page
        if (data.trial_status === 'active') {
          navigate('/stats');
        } else if (data.trial_status === 'expired') {
          navigate('/payment');
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        toast.error('Failed to check trial status');
      } finally {
        setLoading(false);
      }
    };

    checkTrialStatus();
  }, [user, navigate]);

  const startTrial = async () => {
    try {
      setActivating(true);
      const { error } = await supabase
        .from('user_profiles')
        .update({
          trial_started_at: new Date().toISOString(),
          trial_status: 'active'
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Free trial activated! Enjoy your 14-day trial period.');
      navigate('/stats');
    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error('Failed to activate trial');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: "Unlimited QR Codes",
      description: "Generate as many QR codes as you need during your trial period"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Advanced Security",
      description: "Protect your products with our state-of-the-art authentication system"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
      title: "Real-time Analytics",
      description: "Track scans and gather insights about your product usage"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "14-Day Full Access",
      description: "Experience all premium features with no limitations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your 14-Day Free Trial
          </h1>
          <p className="text-xl text-gray-600">
            Experience the full power of QRified with no credit card required
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Join thousands of businesses already using QRified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                onClick={startTrial}
                disabled={activating}
              >
                {activating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Activating...</span>
                  </div>
                ) : (
                  "Start Free Trial"
                )}
              </Button>
              <p className="text-sm text-gray-500">
                By starting your trial, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeTrial; 