import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { getStripe, createCheckoutSession } from '@/integrations/stripe/client';

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyProductId?: string;
  annualProductId?: string;
  features: Array<{ name: string; included: boolean }>;
  recommended: boolean;
  ctaText: string;
}

const PricingSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
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
      ctaText: "Get 14 day free trial"
    },
    {
      name: "Pro",
      description: "For growing businesses ready to build customer trust and scale.",
      monthlyPrice: 49,
      annualPrice: 40, // Approx 20% discount
      features: [
        // Inherited & Upgraded Features
        { name: "Up to 10,000 QR Codes", included: true },
        { name: "Includes everything in Basic, plus:", included: true },
        { name: "Advanced Analytics Dashboard", included: true },
        { name: "Customizable Verification Page", included: true },
        { name: "Customer Reviews & Ratings System", included: true },
        { name: "1 Team Member Seat", included: true },
      ],
      recommended: true,
      ctaText: "Get 14 day free trial"
    },
    {
      name: "Premium",
      description: "For large organizations requiring enterprise-grade control and support.",
      monthlyPrice: 99,
      annualPrice: 82, // Approx 20% discount
      features: [
        // Inherited & Upgraded Features
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
    <section id="pricing" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>
      
      {/* Pricing grid background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4b5563_1px,transparent_1px),linear-gradient(to_bottom,#4b5563_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/50 text-primary-400 text-sm font-mono mb-4">
            <span>Full Protection, From Day One</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Simple, <span className="text-primary-400">Transparent</span> Pricing
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400 mb-8">
            Choose the plan that fits your needs. All plans include our core
            authentication technology and continuous security updates.
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${annually ? 'text-neutral-400' : 'text-white font-medium'}`}>Monthly</span>
            <button 
              onClick={() => setAnnually(!annually)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-800"
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`${
                  annually ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-primary-500 transition`}
              />
            </button>
            <span className={`ml-3 ${annually ? 'text-white font-medium' : 'text-neutral-400'}`}>
              Annually <span className="text-primary-400 text-xs">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className={`relative bg-neutral-900/50 backdrop-blur-sm border ${
                plan.recommended ? 'border-primary-500' : 'border-neutral-800'
              } rounded-xl p-6 md:p-8 ${
                plan.recommended ? 'shadow-glow' : ''
              }`}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 0 15px 0 rgba(0, 73, 255, 0.2)'
              }}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-sm text-neutral-400 h-12">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                {plan.monthlyPrice !== null ? (
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-white">
                      ${annually ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-neutral-400 ml-2 mb-1">/ month</span>
                  </div>
                ) : (
                  <div className="flex items-end">
                    <span className="text-2xl font-bold text-white">Custom Pricing</span>
                  </div>
                )}
                {plan.monthlyPrice !== null && annually && (
                  <p className="text-sm text-primary-400 mt-1">
                    Billed annually (${plan.annualPrice * 12}/year)
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-neutral-600 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-neutral-300' : 'text-neutral-500'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                type="button"
                onClick={() => handleCheckout(plan)}
                disabled={isLoading}
                className={`w-full inline-flex h-12 items-center justify-center rounded-md ${
                  plan.recommended 
                    ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                } px-6 text-base font-medium shadow-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? 'Loading...' : plan.ctaText}
              </motion.button>

              {/* Add 'no credit card required' text for Basic and Pro plans */}
              {plan.name === 'Basic' || plan.name === 'Pro' ? (
                <p className="mt-2 text-center text-sm text-neutral-400">
                  no credit card required
                </p>
              ) : null}

            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-neutral-400 mb-4">
            Need a custom solution? Contact our sales team for a tailored quote.
          </p>
          <motion.a
            href="/signup"
            className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium"
            whileHover={{ x: 5 }}
          >
            Talk to Sales
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-4 w-4"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;