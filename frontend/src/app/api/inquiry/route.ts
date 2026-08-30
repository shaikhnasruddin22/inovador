import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_WRITE_TOKEN = process.env.STRAPI_WRITE_TOKEN;
const TURNSTILE_SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const STUDIO_NOTIFICATION_EMAIL = process.env.STUDIO_NOTIFICATION_EMAIL || 'studio@inovadordesign.example';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Inovador Briefs <onboarding@resend.dev>';

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  projectType: z.string().trim().min(2, 'Please select a project typology').max(100),
  timeline: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000, 'Message is too long'),
  honeypot: z.string().optional().or(z.literal('')),
  turnstileToken: z.string().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // 1. Zod Validation
    const parseResult = inquirySchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ error: firstError }, { status: 422 });
    }

    const { name, email, phone, projectType, timeline, message, honeypot, turnstileToken } =
      parseResult.data;

    // 2. Honeypot Check (Silently reject bot submissions)
    if (honeypot && honeypot.trim().length > 0) {
      console.warn('[Inquiry Spam Blocked]: Honeypot triggered');
      return NextResponse.json({ success: true, message: 'Inquiry received' }, { status: 200 });
    }

    // 3. Cloudflare Turnstile Server-Side Verification (Only if real credentials are configured)
    const isTurnstileConfigured =
      TURNSTILE_SECRET &&
      !TURNSTILE_SECRET.toLowerCase().includes('placeholder') &&
      !TURNSTILE_SECRET.toLowerCase().includes('your_turnstile') &&
      !TURNSTILE_SECRET.startsWith('0x4AAAAAA') &&
      TURNSTILE_SECRET.length > 20;

    if (isTurnstileConfigured) {
      if (!turnstileToken) {
        console.warn('[Turnstile Notice]: Submission without turnstileToken, checking honeypot only.');
      } else {
        try {
          const verifyFormData = new FormData();
          verifyFormData.append('secret', TURNSTILE_SECRET);
          verifyFormData.append('response', turnstileToken);

          const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip');
          if (ip) {
            verifyFormData.append('remoteip', ip);
          }

          const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: verifyFormData,
          });

          const turnstileJson = await turnstileRes.json();
          if (!turnstileJson.success) {
            console.warn('[Turnstile Verification Failed]:', turnstileJson);
            return NextResponse.json(
              { error: 'Security verification failed. Please refresh and try again.' },
              { status: 400 }
            );
          }
        } catch (tsError) {
          console.error('[Turnstile Network Error]:', tsError);
        }
      }
    }

    // 4. Save to Strapi CMS / MySQL
    const strapiHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (STRAPI_WRITE_TOKEN && !STRAPI_WRITE_TOKEN.includes('PLACEHOLDER')) {
      strapiHeaders['Authorization'] = `Bearer ${STRAPI_WRITE_TOKEN}`;
    }

    const strapiPayload = {
      data: {
        name,
        email,
        phone: phone || null,
        projectType,
        timeline: timeline || null,
        message,
        status: 'new',
      },
    };

    const strapiRes = await fetch(`${STRAPI_API_URL}/api/inquiries`, {
      method: 'POST',
      headers: strapiHeaders,
      body: JSON.stringify(strapiPayload),
    });

    if (!strapiRes.ok) {
      const strapiError = await strapiRes.text().catch(() => '');
      console.error(`[Strapi Inquiry Creation Failed ${strapiRes.status}]:`, strapiError);
      return NextResponse.json(
        { error: 'An issue occurred while saving your inquiry. Please try again or reach out directly.' },
        { status: 500 }
      );
    }

    const strapiData = await strapiRes.json().catch(() => ({}));
    const inquiryId = strapiData?.data?.id || strapiData?.data?.documentId || 'NEW';

        // 5a. Send Studio Team Notification
        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: STUDIO_NOTIFICATION_EMAIL,
          replyTo: email,
          subject: `[New Studio Inquiry #${inquiryId}] ${name} — ${projectType}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #111111; line-height: 1.6; background-color: #ffffff;">
              <h2 style="font-family: Georgia, serif; font-size: 24px; font-weight: 300; border-bottom: 2px solid #A45A2A; padding-bottom: 12px; margin-bottom: 24px; color: #111111;">
                New Spatial Commission Inquiry
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 0; color: #737373; width: 140px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Patron Name</td>
                  <td style="padding: 10px 0; font-weight: 600; color: #111111;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                  <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #A45A2A; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Phone</td>
                  <td style="padding: 10px 0; color: #111111;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Typology</td>
                  <td style="padding: 10px 0; font-weight: 600; color: #111111;">${projectType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Timeline</td>
                  <td style="padding: 10px 0; color: #111111;">${timeline || 'Not specified'}</td>
                </tr>
              </table>
              <div style="background-color: #F4F1EC; padding: 20px 24px; border-left: 4px solid #A45A2A; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 15px; font-style: italic; color: #333333; line-height: 1.6; white-space: pre-wrap;">&ldquo;${message}&rdquo;</p>
              </div>
              <p style="font-size: 12px; color: #8C877E; border-top: 1px solid #E5E0D8; padding-top: 16px;">
                Recorded in Inovador CMS · Status: <strong>new</strong> · ID: #${inquiryId}
              </p>
            </div>
          `,
        });

        // 5b. Send Automated Confirmation / Auto-Reply to the User/Patron
        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: email,
          subject: `Thank you for contacting Inovador Design Studio | Commission Inquiry Confirmation`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 24px; color: #111111; line-height: 1.7; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 300; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; color: #111111;">
                  INOVADOR
                </h1>
                <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #8C877E; display: block; margin-top: 6px;">
                  Architecture &amp; Spatial Transformation
                </span>
              </div>
              
              <div style="border-top: 1px solid #E5E0D8; border-bottom: 1px solid #E5E0D8; padding: 28px 0; margin-bottom: 28px;">
                <p style="font-size: 16px; margin-top: 0;">Dear ${name},</p>
                
                <p style="font-size: 15px; color: #333333;">
                  Thank you for your interest in commissioning Inovador Design Studio. We have received your brief regarding your <strong>${projectType}</strong> project.
                </p>
                
                <p style="font-size: 15px; color: #333333;">
                  Our principal architects and design partners review every commission personally. We will connect with you within <strong>24 to 48 business hours</strong> to discuss your site context, scope, and initial advisory alignment.
                </p>

                <div style="background-color: #F4F1EC; padding: 18px 22px; border-left: 3px solid #A45A2A; margin: 24px 0;">
                  <p style="margin: 0; font-size: 13px; color: #555555;">
                    <strong>Inquiry Reference:</strong> #${inquiryId}<br/>
                    <strong>Selected Typology:</strong> ${projectType}<br/>
                    <strong>Direct Studio Line:</strong> +91 22 6984 3200
                  </p>
                </div>

                <p style="font-size: 14px; color: #666666; margin-bottom: 0;">
                  In the interim, we invite you to explore our recent built commissions across India:
                  <br/>
                  <a href="https://www.inovadordesignstudio.com/projects" style="color: #A45A2A; text-decoration: none; font-weight: 500; display: inline-block; margin-top: 8px;">
                    View Selected Portfolio &rarr;
                  </a>
                </p>
              </div>

              <div style="font-size: 12px; color: #8C877E; line-height: 1.5; text-align: center;">
                <p style="margin: 0;">
                  Inovador Design Studio · Kala Ghoda, Mumbai &amp; Assagao, Goa
                  <br/>
                  <a href="https://www.inovadordesignstudio.com" style="color: #8C877E; text-decoration: underline;">www.inovadordesignstudio.com</a>
                </p>
              </div>
            </div>
          `,
        });

        console.log(`[Resend Email + Auto-Reply Sent for Inquiry #${inquiryId}]`);
      } catch (emailErr) {
        console.error('[Resend Email Dispatch Failed]:', emailErr);
      }
    } else {
      console.log(`[Resend Skipped - Mock/Dev Mode]: New inquiry recorded for ${name} (${email})`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry brief received successfully. Our studio directors will review and connect shortly.',
        id: inquiryId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Inquiry Route Error]:', message);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or contact the studio directly.' },
      { status: 500 }
    );
  }
}
