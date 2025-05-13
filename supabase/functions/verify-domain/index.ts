
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to check DNS CNAME records using public DNS API
async function checkCnameRecords(domain: string): Promise<string[]> {
  try {
    // Use Google's DNS API to lookup CNAME records
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`);
    
    if (!response.ok) {
      throw new Error(`DNS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.Answer) {
      return [];
    }
    
    // Extract the CNAME record values
    return data.Answer.map((record: any) => {
      // Make sure the value doesn't end with a dot
      let value = record.data;
      if (value.endsWith('.')) {
        value = value.substring(0, value.length - 1);
      }
      return value;
    });
  } catch (error) {
    console.error("Error checking CNAME records:", error);
    throw error;
  }
}

// Function to check DNS A records using public DNS API
async function checkARecords(domain: string): Promise<string[]> {
  try {
    // Use Google's DNS API to lookup A records
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    
    if (!response.ok) {
      throw new Error(`DNS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.Answer) {
      return [];
    }
    
    // Extract the A record values
    return data.Answer.map((record: any) => record.data);
  } catch (error) {
    console.error("Error checking A records:", error);
    throw error;
  }
}

// Function to check if SSL is provisioned and valid
async function checkSSLCertificate(domain: string): Promise<boolean> {
  try {
    // We'll just check if HTTPS is responding correctly as a proxy for SSL validation
    // In a production environment, you might want more robust checking
    const url = `https://${domain}`;
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        // Very short timeout since we just need to check if SSL is working
        signal: AbortSignal.timeout(10000) 
      });
      
      // If we get any response at all over HTTPS, it means SSL is working
      return response.status < 500; // Any response that's not a server error
    } catch (e) {
      console.log(`SSL check failed for ${domain}:`, e);
      return false;
    }
  } catch (error) {
    console.error("Error checking SSL:", error);
    return false;
  }
}

// Central IP address for your application
const APP_IP_ADDRESS = "76.76.21.21"; 
// CNAME target for your application
const APP_CNAME_TARGET = "qrified.app";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();
    
    if (!domain) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing domain' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    console.log(`Verifying domain ${domain}`);
    
    try {
      // First, check if 'www' subdomain is correctly set up with CNAME
      let verified = false;
      
      // Depending on whether we're checking www subdomain or root domain
      if (domain.startsWith('www.')) {
        // For www subdomain, check CNAME
        const cnameRecords = await checkCnameRecords(domain);
        console.log(`CNAME records for ${domain}:`, cnameRecords);
        
        // Check if any CNAME record points to our app domain
        for (const record of cnameRecords) {
          if (record.includes(APP_CNAME_TARGET)) {
            verified = true;
            break;
          }
        }
      } else {
        // For root domain, check A record
        const aRecords = await checkARecords(domain);
        console.log(`A records for ${domain}:`, aRecords);
        
        // Check if any A record points to our app IP
        for (const record of aRecords) {
          if (record === APP_IP_ADDRESS) {
            verified = true;
            break;
          }
        }
      }
      
      // Also check 'qr' subdomain points to our app
      const qrSubdomain = domain.startsWith('www.') 
        ? `qr.${domain.substring(4)}` 
        : `qr.${domain}`;
      
      const qrCnameRecords = await checkCnameRecords(qrSubdomain);
      console.log(`CNAME records for ${qrSubdomain}:`, qrCnameRecords);
      
      // Both checks must pass - domain and qr subdomain
      let qrVerified = false;
      for (const record of qrCnameRecords) {
        if (record.includes(APP_CNAME_TARGET)) {
          qrVerified = true;
          break;
        }
      }
      
      if (verified && qrVerified) {
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
          .eq('domain', domain);
        
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
            message: 'Verification failed: DNS records not correctly configured' 
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
