import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/integrations/supabase/client';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle lifetime subscription purchase
        if (session.mode === 'payment' && session.payment_status === 'paid') {
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;
          
          // Get customer email from Stripe
          const customer = await stripe.customers.retrieve(customerId);
          const email = customer.email;
          
          if (!email) {
            throw new Error('No email found for customer');
          }

          // Get user profile from Supabase
          const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .single();

          if (profileError) {
            throw new Error('User profile not found');
          }

          // Update user profile with subscription details
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              subscription_type: 'lifetime',
              subscription_status: 'active',
              subscription_started_at: new Date().toISOString(),
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
            })
            .eq('id', userProfile.id);

          if (updateError) {
            throw new Error('Failed to update user profile');
          }

          // The trigger we created will automatically set unlimited QR codes
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Handle subscription cancellation
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'canceled',
            subscription_ends_at: new Date(subscription.canceled_at! * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          throw new Error('Failed to update subscription status');
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
} 