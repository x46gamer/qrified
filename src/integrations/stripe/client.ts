import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const getStripe = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  return stripePromise;
};

// Helper function to format price for display
export const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100); // Convert cents to dollars
};

// Helper function to create a checkout session
export const createCheckoutSession = async (productId: string) => {
  try {
    const supabaseFunctionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'http://localhost:54321';
    const response = await fetch(`${supabaseFunctionsUrl}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 