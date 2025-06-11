import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0"
import Stripe from "https://esm.sh/stripe@14.12.0?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.qrified.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2024-06-20',
  })

  let productId: string | undefined;
  let priceId: string | undefined;
  let isLifetime: boolean = false;

  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) === 0) {
      console.warn('Received request with empty body (Content-Length: 0).');
      return new Response(JSON.stringify({ error: 'Request body is empty.' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    const body = JSON.parse(rawBody);
    productId = body.productId;
    priceId = body.priceId;
    isLifetime = body.isLifetime || false;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response(JSON.stringify({ error: `Invalid request body. Expected JSON. Error: ${error.message}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  // If we have a priceId, use it directly
  if (priceId) {
    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }

  // Otherwise, handle productId as before
  if (!productId) {
    return new Response(JSON.stringify({ error: 'Missing productId or priceId in request body.' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  // Get the product to determine if it's monthly or yearly
  const product = await stripe.products.retrieve(productId)
  const isYearly = product.name.toLowerCase().includes('yearly')
  isLifetime = isLifetime || product.name.toLowerCase().includes('lifetime')

  // Create a price for the product if it doesn't exist
  let finalPriceId: string
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
  })

  if (prices.data.length === 0) {
    // Create a new price for the product
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: isLifetime ? 9900 : (isYearly ? 1500 : 1900), // $99 for lifetime, $15/month yearly or $19/month monthly
      currency: 'usd',
      ...(isLifetime ? {} : {
        recurring: {
          interval: 'month',
          interval_count: isYearly ? 12 : 1,
        },
      }),
    })
    finalPriceId = price.id
  } else {
    // Use the first active price
    finalPriceId = prices.data[0].id
  }

  const session = await stripe.checkout.sessions.create({
    mode: isLifetime ? 'payment' : 'subscription',
    line_items: [
      {
        price: finalPriceId,
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('origin')}/success`,
    cancel_url: `${req.headers.get('origin')}/cancel`,
  })

  return new Response(JSON.stringify({ sessionId: session.id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  })
}) 