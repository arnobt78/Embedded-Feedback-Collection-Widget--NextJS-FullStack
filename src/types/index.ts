/**
 * TypeScript Type Definitions
 * 
 * Centralized type definitions for the application.
 * These types are based on the Prisma schema models.
 */

import { Prisma } from "@prisma/client";

/**
 * Project Model Type
 * 
 * Represents a connected project that uses the feedback widget.
 */
export type Project = Prisma.ProjectGetPayload<{
  include: {
    _count: {
      select: {
        feedbacks: true;
      };
    };
  };
}>;

/**
 * Feedback Model Type
 * 
 * Represents a feedback submission from users.
 */
export type Feedback = Prisma.FeedbackGetPayload<{
  include: {
    project: {
      select: {
        id: true;
        name: true;
        domain: true;
      };
    };
  };
}>;

/**
 * Analytics Data Type
 * 
 * Represents aggregated analytics data.
 * Matches the response structure from /api/business-insights.
 */
export interface AnalyticsData {
  totalFeedback: number;
  averageRating: number;
  ratedFeedbackCount: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
  feedbackByProject: Array<{
    projectId: string | null;
    projectName: string;
    count: number;
  }>;
  recent7Days: number;
  recent30Days: number;
  totalProjects: number;
}

/**
 * Create Project Input Type
 * 
 * Input type for creating a new project.
 */
export interface CreateProjectInput {
  name: string;
  domain: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Update Project Input Type
 * 
 * Input type for updating an existing project.
 */
export interface UpdateProjectInput {
  name: string;
  domain: string;
  description?: string;
  isActive?: boolean;
  regenerateApiKey?: boolean;
}

