import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    name: 'Starter',
    price: 29,
    features: [
      '1000 monthly QR codes',
      'Basic analytics',
      'Standard support',
      '14-day free trial'
    ],
    priceId: 'price_1RVHhFGpLghpVB8NmndSG1hV'
  },
  {
    name: 'Pro',
    price: 59,
    features: [
      '10000 monthly QR codes',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      '14-day free trial'
    ],
    priceId: 'price_1PxqWVGpLghpVB8NrVAn17V1kTY8cB9sx9InMY5fCvA7tJlojyL01NQvjgtkD9BOF8Jd1nnQwPyB0Q7fB00qkiLO5Ue'
  },
  {
    name: 'Enterprise',
    price: 199,
    features: [
      '100000 monthly QR codes',
      'Full analytics suite',
      '24/7 support',
      'Custom integrations',
      'Dedicated account manager'
    ],
    priceId: 'price_1PxqWVGpLghpVB8NrVAn17V1kTY8cB9sx9InMY5fCvA7tJlojyL01NQvjgtkD9BOF8Jd1nnQwPyB0Q7fB00qkiLO5Ue'
  }
];

const SubscribePage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);
      console.log('Starting subscription process for price:', priceId);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create checkout session');
      }

      const { id: sessionId } = await response.json();
      console.log('Checkout session created:', sessionId);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect plan for your QR code needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className={`mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 ${
                    loading === plan.priceId ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading === plan.priceId ? 'Loading...' : 'Subscribe'}
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
