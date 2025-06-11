import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0"
import Stripe from "https://esm.sh/stripe@14.12.0?target=deno"

// Allow both production and development origins
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins during testing
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user from the auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    // Get the request body
    const { priceId, isLifetime } = await req.json();

    if (!priceId) {
      throw new Error('Price ID is required');
    }

    // Initialize Stripe with test key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // For testing, log the request details
    console.log('Creating checkout session for:', {
      userId: user.id,
      email: user.email,
      priceId,
      isLifetime
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId, // Use the test price ID
          quantity: 1,
        },
      ],
      mode: isLifetime ? 'payment' : 'subscription',
      // Use test URLs for development
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: {
        userId: user.id,
        isLifetime: isLifetime ? 'true' : 'false',
        environment: 'test' // Mark as test session
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
    });

    // Log the created session for testing
    console.log('Created session:', session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );

  } catch (error) {
    // Log errors for testing
    console.error('Checkout session error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
}); 