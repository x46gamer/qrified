
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const { domainId } = await req.json();

      if (!domainId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Domain ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Get the domain details
      const { data: domain, error: domainError } = await supabase
        .from('custom_domains')
        .select('*')
        .eq('id', domainId)
        .single();

      if (domainError || !domain) {
        return new Response(
          JSON.stringify({ success: false, error: 'Domain not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // In a real implementation, we would:
      // 1. Look up DNS TXT or CNAME records for the domain 
      // 2. Verify they match the verification token
      // For this demo, we'll simulate verification success

      const verificationSuccess = true; // In real code, check DNS records

      if (verificationSuccess) {
        // Update domain status to verified
        const { error: updateError } = await supabase
          .from('custom_domains')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString(),
          })
          .eq('id', domainId);

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true, verified: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Update domain status to failed
        await supabase
          .from('custom_domains')
          .update({ status: 'failed' })
          .eq('id', domainId);

        return new Response(
          JSON.stringify({ success: false, verified: false, error: 'Domain verification failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  } catch (error) {
    console.error('Error verifying domain:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
