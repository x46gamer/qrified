import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getStripe, createCheckoutSession } from '@/integrations/stripe/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyProductId: string;
  annualProductId: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
  recommended: boolean;
  ctaText: string;
}

const Plans = () => {
  const { user, logout } = useAuth();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [annually, setAnnually] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (plan: Plan) => {
    try {
      setIsLoading(true);
      const productId = annually ? plan.annualProductId : plan.monthlyProductId;
      
      if (!productId) {
        toast.error('This plan is not available for checkout');
        return;
      }

      const sessionId = await createCheckoutSession(productId);
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: "Basic",
      description: "For individuals and small businesses taking their first step in brand protection.",
      monthlyPrice: 19,
      annualPrice: 15, // Approx 20% discount
      monthlyProductId: "prod_STnt7FFeqnDll5",
      annualProductId: "prod_ST3hw6HjjE2lnz",
      features: [
        { name: "Up to 1,000 QR Codes", included: true },
        { name: "Branded Subdomain (yourbrand.service.com)", included: true },
        { name: "QR Code Style Templates", included: true },
        { name: "Basic Analytics Dashboard", included: true },
        { name: "Standard Email Support", included: true },
        { name: "Full RTL Support", included: true },
      ],
      recommended: false,
      ctaText: "Upgrade Now"
    },
    {
      name: "Pro",
      description: "For growing businesses ready to build customer trust and scale.",
      monthlyPrice: 49,
      annualPrice: 40, // Approx 20% discount
      monthlyProductId: "prod_SQ7xkoPstFb6EW",
      annualProductId: "prod_ST3hw6HjjE2lnz",
      features: [
        { name: "Up to 10,000 QR Codes", included: true },
        { name: "Includes everything in Basic, plus:", included: true },
        { name: "Advanced Analytics Dashboard", included: true },
        { name: "Customizable Verification Page", included: true },
        { name: "Customer Reviews & Ratings System", included: true },
        { name: "1 Team Member Seat", included: true },
      ],
      recommended: true,
      ctaText: "Upgrade Now"
    },
    {
      name: "Premium",
      description: "For large organizations requiring enterprise-grade control and support.",
      monthlyPrice: 99,
      annualPrice: 82, // Approx 20% discount
      monthlyProductId: "prod_SQ7xkoPstFb6EW",
      annualProductId: "prod_ST3hw6HjjE2lnz",
      features: [
        { name: "Up to 100,000 QR Codes", included: true },
        { name: "Includes everything in Pro, plus:", included: true },
        { name: "Use Your Own Custom Domain", included: true },
        { name: "Customizable Analytics Dashboard", included: true },
        { name: "Up to 5 Team Members", included: true },
        { name: "Priority Support Queue", included: true },
      ],
      recommended: false,
      ctaText: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Trial Expired Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-1">
                    Your Trial Period Has Ended
                  </h3>
                  <p className="text-red-700">
                    To continue using QRified and access all features, please choose a plan below.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your needs. All plans include our core
            authentication technology and continuous security updates.
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center mt-8 mb-12">
            <span className={`mr-3 ${annually ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>Monthly</span>
            <button 
              onClick={() => setAnnually(!annually)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`${
                  annually ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-blue-600 transition`}
              />
            </button>
            <span className={`ml-3 ${annually ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              Annually <span className="text-blue-600 text-xs">(Save 20%)</span>
            </span>
          </div>
          <div className="mt-4">
            <Button 
              onClick={logout}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white border ${
                plan.recommended ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              } rounded-xl p-6 md:p-8`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600 h-12">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-4xl font-bold text-gray-900">
                    ${annually ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600 ml-2 mb-1">/ month</span>
                </div>
                {annually && (
                  <p className="text-sm text-blue-600 mt-1">
                    Billed annually (${plan.annualPrice * 12}/year)
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleCheckout(plan)}
                disabled={isLoading}
                className={`w-full h-12 ${
                  plan.recommended 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isLoading ? 'Processing...' : plan.ctaText}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Need a custom solution? Contact our sales team for a tailored quote.
          </p>
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Plans; 