/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0"
import Stripe from "https://esm.sh/stripe@14.12.0?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Allow all origins during development
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

const stripeClient = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20'
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  // Only process POST requests for checkout sessions
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  let productId: string | undefined;

  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) === 0) {
      console.warn('Received request with empty body (Content-Length: 0).');
      throw new Error('Request body is empty.');
    }

    const rawBody = await req.text();
    // console.log('Raw request body:', rawBody); // Uncomment for debugging

    const body = JSON.parse(rawBody);
    productId = body.productId;

    if (!productId) {
      throw new Error('Missing productId in request body.');
    }
  } catch (error: any) {
    console.error('Error processing request:', error.message);
    return new Response(JSON.stringify({ error: `Invalid request: ${error.message}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  let sessionConfig;

  // Define your lifetime product ID from the frontend
  const LIFETIME_FRONTEND_PRODUCT_ID = 'prod_STjyRAv61Ylnaf'; 

  // Get the actual Stripe Price ID for the one-time lifetime offer from environment variables
  const LIFETIME_ONE_TIME_PRICE_ID = Deno.env.get('LIFETIME_PRICE_ID');

  if (productId === LIFETIME_FRONTEND_PRODUCT_ID) {
    if (!LIFETIME_ONE_TIME_PRICE_ID) {
        console.error('Environment variable LIFETIME_PRICE_ID not set!');
        return new Response(JSON.stringify({ error: 'Server configuration error: Lifetime price ID not set.' }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }

    // Configure for a one-time payment checkout session
    sessionConfig = {
      mode: 'payment',
      line_items: [{
        price: LIFETIME_ONE_TIME_PRICE_ID, 
        quantity: 1,
      }],
      success_url: `${req.headers.get('referer')}success`,
      cancel_url: `${req.headers.get('referer')}cancel`,
      automatic_tax: { enabled: true },
    };
  } else {
    // For all other product IDs, assume they are recurring subscription Price IDs
    sessionConfig = {
      mode: 'subscription',
      line_items: [{
        price: productId, // Assuming productId from frontend is already the recurring Price ID
          quantity: 1,
      }],
      success_url: `${req.headers.get('referer')}success`,
      cancel_url: `${req.headers.get('referer')}cancel`,
      automatic_tax: { enabled: true },
    };
  }

  try {
    const session = await stripeClient.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error('Stripe Checkout Session Creation Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
}) 