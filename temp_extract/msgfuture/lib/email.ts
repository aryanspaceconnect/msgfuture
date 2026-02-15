import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_xxxxxxxxx';

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('RESEND_API_KEY environment variable is not set');
}

export const resend = new Resend(resendApiKey);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const data = await resend.emails.send({
      from: 'MsgFuture <onboarding@resend.dev>', // Update this with your verified domain if available
      to: [to],
      subject: subject,
      html: html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
