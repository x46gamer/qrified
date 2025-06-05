import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const MAILERSEND_API_KEY = 'mlsn.82bf69fdcfbac2cae353749444fe45aa6c69c0b19ba299be68473f8c97e303f2';
const MAILERSEND_API_URL = 'https://api.mailersend.com/v1';

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(`${MAILERSEND_API_URL}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERSEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: {
          email: 'noreply@qrified.app',
          name: 'QRified Team'
        },
        to: [
          {
            email: to,
            name: to.split('@')[0]
          }
        ],
        subject,
        html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 