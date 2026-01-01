/**
 * API Route: /api/projects
 * 
 * Next.js App Router API Route Handler for Project Management
 * This file exports HTTP method handlers (GET, POST, OPTIONS) for the projects API endpoint.
 * 
 * Features:
 * - GET: List all projects
 * - POST: Create a new project
 * - OPTIONS: Handle CORS preflight requests
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCORS } from "@/lib/api-utils";
import { randomBytes } from "crypto";

/**
 * Generate a secure random API key for a project
 * 
 * @returns {string} A random 32-character hexadecimal string
 */
function generateApiKey(): string {
  return randomBytes(16).toString("hex");
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
  return withCORS(new NextResponse(null, { status: 204 }));
}

/**
 * GET Handler - List All Projects
 * 
 * Fetches all projects from the database, ordered by creation date (newest first).
 * 
 * @param {Request} request - The incoming HTTP request
 * @returns {NextResponse} JSON response with array of projects or error
 * 
 * Status Codes:
 * - 200: Successfully retrieved
 * - 500: Database/server error
 */
export async function GET() {
  try {
    // Fetch all projects, ordered by newest first
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" }, // Most recent first
      include: {
        _count: {
          select: {
            feedbacks: true, // Include count of feedback entries per project
          },
        },
      },
    });
    return withCORS(NextResponse.json(projects, { status: 200 })); // 200 = OK
  } catch (error) {
    // Catch any database errors
    console.error("Error fetching projects:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    );
  }
}

/**
 * POST Handler - Create New Project
 * 
 * Accepts project data (name, domain, description) and creates a new project
 * with a generated API key.
 * 
 * Request Body:
 * - name: Project name (required)
 * - domain: Project domain/URL (required)
 * - description: Optional project description
 * - isActive: Whether project is active (default: true)
 * 
 * @param {Request} request - The incoming HTTP request with JSON body
 * @returns {NextResponse} JSON response with created project or error
 * 
 * Status Codes:
 * - 201: Successfully created
 * - 400: Validation error (missing required fields)
 * - 500: Database/server error
 */
export async function POST(request: Request) {
  try {
    // Parse JSON body from request
    const body = await request.json();
    const { name, domain, description, isActive } = body;
    
    // Validation: name and domain are required
    if (!name || !domain) {
      return withCORS(
        NextResponse.json(
          { error: "Name and domain are required" },
          { status: 400 }
        )
      );
    }
    
    // Generate unique API key for the project
    const apiKey = generateApiKey();
    
    // Create project in database
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        domain: domain.trim(),
        description: description?.trim() || null,
        apiKey: apiKey,
        isActive: isActive !== undefined ? isActive : true, // Default to active
      },
      include: {
        _count: {
          select: {
            feedbacks: true, // Include count of feedback entries
          },
        },
      },
    });
    
    return withCORS(NextResponse.json(project, { status: 201 })); // 201 = Created
  } catch (error) {
    // Catch any database errors (e.g., unique constraint violation for apiKey)
    console.error("Error creating project:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    );
  }
}

