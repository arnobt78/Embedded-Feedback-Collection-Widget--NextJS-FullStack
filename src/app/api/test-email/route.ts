/**
 * Test Email API Route
 *
 * Endpoint to test email sending functionality.
 * Useful for debugging email configuration in production.
 *
 * GET /api/test-email - Test email sending
 */

import { NextResponse } from "next/server";
import { sendFeedbackNotificationEmail } from "@/lib/email";

/**
 * GET Handler - Test Email Sending
 *
 * Sends a test email notification to verify email configuration.
 *
 * @returns {NextResponse} JSON response with test result
 */
export async function GET() {
  try {
    // Check if environment variables are set
    const envCheck = {
      BREVO_API_KEY: !!process.env.BREVO_API_KEY,
      BREVO_SENDER_EMAIL: !!process.env.BREVO_SENDER_EMAIL,
      BREVO_ADMIN_EMAIL: !!process.env.BREVO_ADMIN_EMAIL,
      RESEND_TOKEN: !!process.env.RESEND_TOKEN,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "not set",
    };

    // Send test email
    const result = await sendFeedbackNotificationEmail({
      projectName: "Test Project",
      projectDomain: "https://example.com",
      feedbackId: "test-" + Date.now(),
      submitterName: "Test User",
      submitterEmail: "test@example.com",
      message: "This is a test email to verify email configuration.",
      rating: 5,
      createdAt: new Date(),
      dashboardUrl: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/dashboard/feedback/test`
        : undefined,
    });

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Email sent successfully via ${result.provider}`
        : `Email sending failed: ${result.error}`,
      result: result,
      environmentVariables: envCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        environmentVariables: {
          BREVO_API_KEY: !!process.env.BREVO_API_KEY,
          BREVO_SENDER_EMAIL: !!process.env.BREVO_SENDER_EMAIL,
          BREVO_ADMIN_EMAIL: !!process.env.BREVO_ADMIN_EMAIL,
          RESEND_TOKEN: !!process.env.RESEND_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}

