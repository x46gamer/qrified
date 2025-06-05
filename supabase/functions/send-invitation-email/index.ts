import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const MAILERSEND_API_KEY = 'mlsn.82bf69fdcfbac2cae353749444fe45aa6c69c0b19ba299be68473f8c97e303f2';
const MAILERSEND_API_URL = 'https://api.mailersend.com/v1';

serve(async (req) => {
  try {
    const { email, inviteLink } = await req.json();

    if (!email || !inviteLink) {
      return new Response(
        JSON.stringify({ error: 'Email and invite link are required' }),
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
            email: email,
            name: email.split('@')[0]
          }
        ],
        subject: 'You\'ve been invited to join QRified',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to QRified!</h2>
            <p>You've been invited to join QRified as a team member.</p>
            <p>Click the button below to accept the invitation and create your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This invitation link will expire in 7 days. If you didn't request this invitation, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              If the button above doesn't work, copy and paste this link into your browser:<br>
              <span style="color: #2563eb;">${inviteLink}</span>
            </p>
          </div>
        `
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