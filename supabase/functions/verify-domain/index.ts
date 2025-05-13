
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
async function checkSSLCertificate(domain: string): Promise<{isValid: boolean; status: string}> {
  try {
    console.log(`Checking SSL for domain: ${domain}`);
    // We'll check if HTTPS is responding correctly as a proxy for SSL validation
    const url = `https://${domain}`;
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        // Short timeout since we just need to check if SSL is working
        signal: AbortSignal.timeout(10000) 
      });
      
      // If we get any response at all over HTTPS, it means SSL is working
      if (response.status < 500) {
        console.log(`SSL is working for ${domain}`);
        return { isValid: true, status: 'active' };
      } else {
        console.log(`SSL check failed for ${domain} with status: ${response.status}`);
        return { isValid: false, status: 'failed' };
      }
    } catch (e: any) {
      console.log(`SSL check failed for ${domain}:`, e);
      // If it's a TLS error or timeout, the certificate might be provisioning
      if (e.message.includes('TLS') || e.message.includes('certificate') || e.message.includes('timeout')) {
        return { isValid: false, status: 'pending' };
      }
      return { isValid: false, status: 'failed' };
    }
  } catch (error: any) {
    console.error("Error checking SSL:", error);
    return { isValid: false, status: 'failed' };
  }
}

// Initiate SSL provisioning
async function initiateSSLProvisioning(domain: string): Promise<boolean> {
  try {
    // In a real-world scenario, you might call an API to explicitly request SSL
    // For this implementation, we're relying on the platform's automatic SSL provisioning
    // after DNS records are correctly set up.
    
    console.log(`Initiated SSL provisioning for ${domain}`);
    return true;
  } catch (error) {
    console.error("Error initiating SSL provisioning:", error);
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
    const { domain, action } = await req.json();
    
    if (!domain) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing domain' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle different actions
    if (action === 'check_ssl') {
      // Check SSL status for an already verified domain
      try {
        const sslStatus = await checkSSLCertificate(domain);
        
        // Update the SSL status in the database
        if (sslStatus.isValid || sslStatus.status !== 'pending') {
          const { error } = await supabase
            .from('custom_domains')
            .update({
              ssl_status: sslStatus.status
            })
            .eq('domain', domain);
          
          if (error) {
            console.error('Error updating SSL status:', error);
          }
        }
        
        return new Response(
          JSON.stringify({ success: true, ssl: sslStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        console.error('SSL check error:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `SSL check error: ${error.message}` 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
    } else {
      // Default action: verify domain
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
          // Initiate SSL provisioning
          const sslInitiated = await initiateSSLProvisioning(domain);
          
          // Initial SSL check 
          const sslStatus = await checkSSLCertificate(domain);
          console.log(`Initial SSL status for ${domain}:`, sslStatus);
          
          // Update the domain status in the database
          const { error } = await supabase
            .from('custom_domains')
            .update({
              status: 'verified',
              verified_at: new Date().toISOString(),
              ssl_status: sslStatus.status
            })
            .eq('domain', domain);
          
          if (error) {
            console.error('Error updating domain:', error);
            throw error;
          }
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              verified: true,
              ssl: { initiated: sslInitiated, status: sslStatus.status }
            }),
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
      } catch (error: any) {
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
    }
  } catch (error: any) {
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
