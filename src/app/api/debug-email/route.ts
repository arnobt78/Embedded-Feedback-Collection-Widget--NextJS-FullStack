/**
 * Debug Email API Route
 *
 * Endpoint to check email sending status and environment variables.
 * Useful for debugging email issues in production.
 *
 * GET /api/debug-email - Check email configuration and recent status
 */

import { NextResponse } from "next/server";

/**
 * GET Handler - Debug Email Configuration
 *
 * Shows environment variable status and email configuration.
 * Does not send any emails, just shows configuration.
 *
 * @returns {NextResponse} JSON response with configuration status
 */
export async function GET() {
  // Check environment variables
  const envStatus = {
    BREVO_API_KEY: process.env.BREVO_API_KEY
      ? `${process.env.BREVO_API_KEY.substring(0, 10)}...` // Show only first 10 chars
      : "NOT SET",
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || "NOT SET",
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || "NOT SET",
    BREVO_ADMIN_EMAIL: process.env.BREVO_ADMIN_EMAIL || "NOT SET",
    RESEND_TOKEN: process.env.RESEND_TOKEN
      ? `${process.env.RESEND_TOKEN.substring(0, 10)}...` // Show only first 10 chars
      : "NOT SET",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
  };

  // Check if all required vars are set
  const allSet =
    process.env.BREVO_API_KEY &&
    process.env.BREVO_SENDER_EMAIL &&
    process.env.BREVO_ADMIN_EMAIL;

  return NextResponse.json({
    status: allSet ? "✅ Configuration looks good" : "❌ Missing required variables",
    environmentVariables: envStatus,
    emailWillBeSentTo: process.env.BREVO_ADMIN_EMAIL || "NOT SET",
    instructions: {
      testEmail: "Visit /api/test-email to send a test email",
      checkLogs: "Check Vercel Dashboard → Logs for email sending status",
      submitFeedback: "Submit feedback from your marketing site and check your inbox",
    },
  });
}

