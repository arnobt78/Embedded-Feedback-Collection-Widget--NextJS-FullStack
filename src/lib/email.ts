/**
 * Email Service Utility
 *
 * Provides email sending functionality with multi-provider support and automatic fallback.
 * Uses Brevo as primary provider, Resend as fallback.
 *
 * Features:
 * - Brevo API integration (primary)
 * - Resend API integration (fallback)
 * - Automatic fallback on failure
 * - Professional HTML email templates
 * - Error handling and logging
 */

/**
 * Email send result type
 */
export type EmailSendResult = {
  success: boolean;
  provider?: string;
  messageId?: string;
  error?: string;
};

/**
 * Feedback notification email data
 */
export type FeedbackEmailData = {
  projectName: string;
  projectDomain: string;
  feedbackId: string;
  submitterName?: string | null;
  submitterEmail?: string | null;
  message: string;
  rating?: number | null;
  createdAt: Date;
  dashboardUrl?: string;
};

/**
 * Send email via Brevo API (Primary Provider)
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML content
 * @param {string} textContent - Email plain text content (optional)
 * @returns {Promise<{ messageId: string }>} Brevo API response with message ID
 */
async function sendEmailViaBrevo(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<{ messageId: string }> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "arnobt78@gmail.com";
  const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Feedback Widget";

  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY environment variable is not set");
  }

  const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

  const emailData = {
    sender: {
      name: BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject: subject,
    htmlContent: htmlContent,
    ...(textContent && { textContent: textContent }),
    replyTo: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    headers: {
      "X-Mailer": "Feedback Widget Email System",
      "Auto-Submitted": "auto-generated",
    },
  };

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return { messageId: result.messageId || result.id || "unknown" };
}

/**
 * Send email via Resend API (Fallback Provider)
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML content
 * @param {string} textContent - Email plain text content (optional)
 * @returns {Promise<{ messageId: string }>} Resend API response with message ID
 */
async function sendEmailViaResend(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<{ messageId: string }> {
  const RESEND_API_KEY = process.env.RESEND_TOKEN || process.env.RESEND_API_KEY;
  const RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "arnobt78@gmail.com";

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY or RESEND_TOKEN environment variable is not set");
  }

  const RESEND_API_URL = "https://api.resend.com/emails";

  const emailData = {
    from: RESEND_SENDER_EMAIL,
    to: [to],
    subject: subject,
    html: htmlContent,
    ...(textContent && { text: textContent }),
  };

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return { messageId: result.id || "unknown" };
}

/**
 * Send email with automatic fallback (Brevo → Resend)
 *
 * Tries Brevo first, falls back to Resend if Brevo fails.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML content
 * @param {string} textContent - Email plain text content (optional)
 * @returns {Promise<EmailSendResult>} Email send result with provider info
 */
export async function sendEmailWithFallback(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<EmailSendResult> {
  const providers = [
    {
      name: "Brevo",
      send: () => sendEmailViaBrevo(to, subject, htmlContent, textContent),
    },
    {
      name: "Resend",
      send: () => sendEmailViaResend(to, subject, htmlContent, textContent),
    },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const result = await provider.send();
      return {
        success: true,
        provider: provider.name,
        messageId: result.messageId,
      };
    } catch (error) {
      console.warn(`⚠️ ${provider.name} email send failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to next provider
    }
  }

  // All providers failed
  console.error("❌ All email providers failed");
  return {
    success: false,
    error: lastError?.message || "Unknown error",
  };
}

/**
 * Generate email subject with timestamp and random number to avoid spam
 *
 * @param {string} projectName - Project name
 * @returns {string} Email subject with timestamp and random number
 */
export function generateFeedbackEmailSubject(projectName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `New Feedback: ${projectName} [${timestamp}-${randomNum}]`;
}

/**
 * Generate plain text version of feedback email
 *
 * @param {FeedbackEmailData} data - Feedback email data
 * @returns {string} Plain text email content
 */
function generateFeedbackEmailText(data: FeedbackEmailData): string {
  const ratingText = data.rating
    ? `${data.rating} ${data.rating === 1 ? "star" : "stars"}`
    : "No rating";
  const submitterInfo = data.submitterName
    ? `${data.submitterName}${data.submitterEmail ? ` (${data.submitterEmail})` : ""}`
    : data.submitterEmail || "Anonymous";

  return `
New Feedback Received

Project: ${data.projectName}
Domain: ${data.projectDomain}
Rating: ${ratingText}

From: ${submitterInfo}

Message:
${data.message}

Submitted: ${data.createdAt.toLocaleString()}

${data.dashboardUrl ? `View Details: ${data.dashboardUrl}` : ""}
  `.trim();
}

/**
 * Generate HTML email template for feedback notification
 *
 * Creates a professional, responsive HTML email that works across all email providers.
 *
 * @param {FeedbackEmailData} data - Feedback email data
 * @returns {string} HTML email content
 */
export function generateFeedbackEmailHTML(data: FeedbackEmailData): string {
  const ratingStars = data.rating
    ? "⭐".repeat(data.rating) + "☆".repeat(5 - data.rating)
    : "No rating provided";
  const ratingText = data.rating
    ? `${data.rating} out of 5 stars`
    : "No rating provided";
  const submitterInfo = data.submitterName
    ? `${data.submitterName}${data.submitterEmail ? ` <${data.submitterEmail}>` : ""}`
    : data.submitterEmail || "Anonymous";

  const formattedDate = data.createdAt.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Professional HTML email template (works across Gmail, Outlook, Yahoo, etc.)
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Feedback Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Feedback Received</h1>
            </td>
          </tr>

          <!-- Project Info -->
          <tr>
            <td style="padding: 25px 30px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 0 10px 0;">
                    <strong style="color: #495057; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project Name</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 15px 0;">
                    <span style="color: #212529; font-size: 18px; font-weight: 600;">${escapeHtml(data.projectName)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <strong style="color: #495057; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project URL</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <a href="${escapeHtml(data.projectDomain)}" style="color: #667eea; text-decoration: none; font-size: 14px; word-break: break-all;">${escapeHtml(data.projectDomain)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Rating -->
          ${data.rating ? `
          <tr>
            <td style="padding: 20px 30px; border-bottom: 1px solid #e9ecef;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 0 8px 0;">
                    <strong style="color: #495057; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Rating</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <span style="font-size: 20px; letter-spacing: 2px;">${ratingStars}</span>
                    <span style="color: #6c757d; font-size: 14px; margin-left: 10px;">${ratingText}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}

          <!-- Submitter Info -->
          <tr>
            <td style="padding: 20px 30px; border-bottom: 1px solid #e9ecef;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 0 8px 0;">
                    <strong style="color: #495057; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted By</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <span style="color: #212529; font-size: 16px;">${escapeHtml(submitterInfo)}</span>
                    ${data.submitterEmail ? `
                    <a href="mailto:${escapeHtml(data.submitterEmail)}" style="color: #667eea; text-decoration: none; margin-left: 10px; font-size: 14px;">✉ Reply</a>
                    ` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 25px 30px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 0 15px 0;">
                    <strong style="color: #495057; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Feedback Message</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                    <p style="margin: 0; color: #212529; font-size: 15px; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Info -->
          <tr>
            <td style="padding: 0 30px 25px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 0 5px 0;">
                    <span style="color: #6c757d; font-size: 12px;">Submitted: ${escapeHtml(formattedDate)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <span style="color: #6c757d; font-size: 12px;">Feedback ID: ${escapeHtml(data.feedbackId)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          ${data.dashboardUrl ? `
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0;">
                    <a href="${escapeHtml(data.dashboardUrl)}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; text-align: center;">View Details in Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center;">
                This is an automated notification from Feedback Widget.
                <br>
                You received this email because a new feedback was submitted to your project.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Send feedback notification email
 *
 * Sends a professional HTML email notification when new feedback is submitted.
 * Uses Brevo as primary provider, Resend as fallback.
 *
 * @param {FeedbackEmailData} data - Feedback email data
 * @param {string} recipientEmail - Recipient email address (defaults to admin email)
 * @returns {Promise<EmailSendResult>} Email send result
 */
export async function sendFeedbackNotificationEmail(
  data: FeedbackEmailData,
  recipientEmail?: string
): Promise<EmailSendResult> {
  const adminEmail = process.env.BREVO_ADMIN_EMAIL || "arnobt78@gmail.com";
  const to = recipientEmail || adminEmail;

  // Generate subject with timestamp and random number to avoid spam
  const subject = generateFeedbackEmailSubject(data.projectName);

  // Generate HTML and text content
  const htmlContent = generateFeedbackEmailHTML(data);
  const textContent = generateFeedbackEmailText(data);

  // Send email with fallback
  return await sendEmailWithFallback(to, subject, htmlContent, textContent);
}

