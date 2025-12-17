/**
 * API Route: /api/feedback
 * 
 * Next.js App Router API Route Handler
 * This file exports HTTP method handlers (GET, POST, OPTIONS) for the feedback API endpoint.
 * 
 * Features:
 * - CORS support for cross-origin requests (allows widget embedding)
 * - POST: Create new feedback entries
 * - GET: Retrieve all feedback entries
 * - OPTIONS: Handle CORS preflight requests
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Helper function to add CORS headers to responses
 * 
 * CORS (Cross-Origin Resource Sharing) allows the widget to be embedded
 * on different domains than where the API is hosted.
 * 
 * @param {NextResponse} response - The Next.js response object
 * @returns {NextResponse} Response with CORS headers added
 */
function withCORS(response) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins (for widget embedding)
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS"); // Allowed HTTP methods
  response.headers.set("Access-Control-Allow-Headers", "Content-Type"); // Allowed request headers
  return response;
}

/**
 * OPTIONS Handler - CORS Preflight Request
 * 
 * Browsers send OPTIONS requests before actual POST/GET requests
 * when making cross-origin requests. This handler responds with
 * allowed CORS headers so the browser knows the actual request is safe.
 * 
 * Status 204 = No Content (successful preflight)
 */
export async function OPTIONS() {
  // Preflight CORS support
  return withCORS(new NextResponse(null, { status: 204 }));
}

/**
 * POST Handler - Create New Feedback Entry
 * 
 * Accepts feedback data (name, email, message, rating) and saves it to the database.
 * 
 * @param {Request} request - The incoming HTTP request with JSON body
 * @returns {NextResponse} JSON response with created feedback or error
 * 
 * Status Codes:
 * - 201: Successfully created
 * - 400: Validation error (missing required message)
 * - 500: Database/server error
 */
export async function POST(request) {
  // Parse JSON body from request
  const body = await request.json();
  const { name, email, message, rating } = body; // rating included
  
  // Validation: message is required (other fields are optional)
  if (!message) {
    return withCORS(
      NextResponse.json({ error: "Message is required" }, { status: 400 })
    );
  }
  
  try {
    // Save feedback to database using Prisma ORM
    // Prisma provides type-safe database access
    const feedback = await prisma.feedback.create({
      data: { name, email, message, rating }, // store rating
    });
    return withCORS(NextResponse.json(feedback, { status: 201 })); // 201 = Created
  } catch {
    // Catch any database errors (connection, validation, etc.)
    return withCORS(
      NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    );
  }
}

/**
 * GET Handler - Retrieve All Feedback Entries
 * 
 * Fetches all feedback entries from the database, ordered by creation date
 * (newest first). Useful for dashboards or admin panels.
 * 
 * @returns {NextResponse} JSON response with array of feedback entries or error
 * 
 * Status Codes:
 * - 200: Successfully retrieved
 * - 500: Database/server error
 */
export async function GET() {
  try {
    // Fetch all feedback entries, ordered by newest first
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" }, // Most recent first
    });
    return withCORS(NextResponse.json(feedbacks, { status: 200 })); // 200 = OK
  } catch {
    // Catch any database errors
    return withCORS(
      NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 })
    );
  }
}
