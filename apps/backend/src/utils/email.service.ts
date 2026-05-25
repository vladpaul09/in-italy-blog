import { Resend } from "resend";
import "dotenv/config";
import config from "../config/app.config";

interface SendOptInEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  locale?: string;
  token: string;
}

/**
 * Send opt-in email to newly registered user
 */
export const sendOptInEmail = async ({ to, firstName, lastName, locale = "it", token }: SendOptInEmailParams) => {
  try {
    const fromEmail = config.resend.fromEmail;
    const fromName = config.resend.fromName;
    const frontendUrl = `${config.frontendUrl}/${locale}/verify-email/${token}`;

    // Email templates based on locale
    const emailTemplates: Record<string, { subject: string; html: string }> = {
      it: {
        subject: "Benvenuto su In Italy! Conferma la tua registrazione",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Benvenuto su In Italy</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2c3e50; margin-bottom: 20px;">Benvenuto su In Italy!</h1>
              
              <p>Ciao ${firstName} ${lastName},</p>
              
              <p>Grazie per esserti registrato su In Italy! Siamo felici di averti nella nostra community.</p>
              
              <p>Per completare la tua registrazione e attivare il tuo account, clicca sul pulsante qui sotto per confermare il tuo indirizzo email.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${frontendUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Conferma la tua email
                </a>
              </div>
              
              <p>Dopo aver confermato la tua email, potrai accedere al tuo account e iniziare a esplorare tutto ciò che l'Italia ha da offrire.</p>
              
              <p>Se hai domande o hai bisogno di assistenza, non esitare a contattarci.</p>
              
              <p>Buona esplorazione!</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                Il team di In Italy<br>
                <a href="${frontendUrl}" style="color: #007bff;">${frontendUrl}</a>
              </p>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: "Welcome to In Italy! Confirm your registration",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to In Italy</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome to In Italy!</h1>
              
              <p>Hello ${firstName} ${lastName},</p>
              
              <p>Thank you for registering with In Italy! We're thrilled to have you in our community.</p>
              
              <p>To complete your registration and activate your account, please click the button below to confirm your email address.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${frontendUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Confirm your email
                </a>
              </div>
              
              <p>After confirming your email, you can access your account and start exploring everything Italy has to offer.</p>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
              
              <p>Happy exploring!</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                The In Italy Team<br>
                <a href="${frontendUrl}" style="color: #007bff;">${frontendUrl}</a>
              </p>
            </div>
          </body>
          </html>
        `,
      },
    };

    const template = emailTemplates[locale] || emailTemplates["it"];

    // Initialize Resend client
    const resend = new Resend(config.resend.apiKey);
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error("Error sending opt-in email:", error);
      return { success: false, error };
    }

    console.log("Opt-in email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending opt-in email:", error);
    return { success: false, error };
  }
};

interface SendPasswordResetEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  locale?: string;
  token: string;
}

/**
 * Send password reset email to user
 */
export const sendPasswordResetEmail = async ({ to, firstName, lastName, locale = "it", token }: SendPasswordResetEmailParams) => {
  try {
    const fromEmail = config.resend.fromEmail;
    const fromName = config.resend.fromName;
    const frontendUrl = `${config.frontendUrl}/${locale}/reset-password/${token}`;

    // Email templates based on locale
    const emailTemplates: Record<string, { subject: string; html: string }> = {
      it: {
        subject: "Reimposta la tua password - In Italy",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reimposta password - In Italy</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2c3e50; margin-bottom: 20px;">Reimposta la tua password</h1>
              
              <p>Ciao ${firstName} ${lastName},</p>
              
              <p>Abbiamo ricevuto una richiesta per reimpostare la password del tuo account In Italy.</p>
              
              <p>Se hai richiesto tu questa modifica, clicca sul pulsante qui sotto per creare una nuova password. Il link sarà valido per 1 ora.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${frontendUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reimposta password
                </a>
              </div>
              
              <p>Se non hai richiesto questa modifica, puoi ignorare questa email. La tua password rimarrà invariata.</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                Per motivi di sicurezza, questo link scadrà tra 1 ora.<br>
                Se il pulsante non funziona, copia e incolla questo link nel tuo browser:<br>
                <a href="${frontendUrl}" style="color: #007bff; word-break: break-all;">${frontendUrl}</a>
              </p>
              
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                Il team di In Italy<br>
                <a href="${config.frontendUrl}" style="color: #007bff;">${config.frontendUrl}</a>
              </p>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: "Reset your password - In Italy",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset password - In Italy</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2c3e50; margin-bottom: 20px;">Reset your password</h1>
              
              <p>Hello ${firstName} ${lastName},</p>
              
              <p>We received a request to reset the password for your In Italy account.</p>
              
              <p>If you requested this change, click the button below to create a new password. This link will be valid for 1 hour.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${frontendUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reset password
                </a>
              </div>
              
              <p>If you did not request this change, you can ignore this email. Your password will remain unchanged.</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                For security reasons, this link will expire in 1 hour.<br>
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${frontendUrl}" style="color: #007bff; word-break: break-all;">${frontendUrl}</a>
              </p>
              
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                The In Italy Team<br>
                <a href="${config.frontendUrl}" style="color: #007bff;">${config.frontendUrl}</a>
              </p>
            </div>
          </body>
          </html>
        `,
      },
    };

    const template = emailTemplates[locale] || emailTemplates["it"];

    // Initialize Resend client
    const resend = new Resend(config.resend.apiKey);
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, error };
    }

    console.log("Password reset email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending password reset email:", error);
    return { success: false, error };
  }
};
