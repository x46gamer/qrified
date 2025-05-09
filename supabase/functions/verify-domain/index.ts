
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { resolveTxt } from 'https://deno.land/x/dns@v1.0.1/mod.ts';

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
    // Validate the request body exists
    if (!req.body) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing request body' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const { domain, token } = await req.json();
    
    if (!domain || !token) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing domain or token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    console.log(`Verifying domain ${domain} with token ${token}`);
    
    try {
      // Check TXT record
      const expected = `seqrity-verify=${token}`;
      const records = await resolveTxt(domain);
      
      let verified = false;
      
      for (const record of records) {
        for (const value of record) {
          console.log(`Checking record: ${value}`);
          if (value === expected) {
            verified = true;
            break;
          }
        }
        if (verified) break;
      }
      
      if (verified) {
        // Update the domain status in the database
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { error } = await supabase
          .from('custom_domains')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString()
          })
          .eq('domain', domain)
          .eq('verification_token', token);
        
        if (error) {
          console.error('Error updating domain:', error);
          throw error;
        }
        
        return new Response(
          JSON.stringify({ success: true, verified: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: true, 
            verified: false, 
            message: 'Verification failed: TXT record not found or incorrect' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('DNS resolution error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `DNS resolution error: ${error.message}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Unexpected error: ${error.message}` }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
