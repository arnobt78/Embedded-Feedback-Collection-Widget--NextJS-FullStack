/**
 * useFeedback Hook
 * 
 * React Query hook for fetching and managing feedback.
 * Provides queries for feedback operations.
 * 
 * Features:
 * - Infinite cache (data cached until invalidated)
 * - Filter by project ID
 * - Type-safe API calls
 * - Error handling
 * 
 * Usage:
 * ```tsx
 * const { data: feedback, isLoading } = useFeedback();
 * const { data: projectFeedback } = useFeedback(projectId);
 * ```
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { Feedback } from "@/types";

/**
 * Fetch feedback from the API.
 * 
 * @param {string | null} projectId - Optional project ID to filter by
 * @returns {Promise<Feedback[]>} Array of feedback entries
 */
async function fetchFeedback(projectId?: string | null): Promise<Feedback[]> {
  const url = projectId
    ? `/api/feedback?projectId=${projectId}`
    : "/api/feedback";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }
  return response.json();
}

/**
 * React Query Keys
 * 
 * Centralized query keys for consistent cache management.
 */
export const feedbackKeys = {
  all: ["feedback"] as const,
  lists: () => [...feedbackKeys.all, "list"] as const,
  list: (projectId?: string | null) =>
    [...feedbackKeys.lists(), projectId] as const,
};

/**
 * useFeedback Hook
 * 
 * Fetches feedback entries, optionally filtered by project ID.
 * 
 * @param {string | null | undefined} projectId - Optional project ID to filter by
 * @returns {UseQueryResult<Feedback[]>} React Query result
 */
export function useFeedback(projectId?: string | null) {
  return useQuery({
    queryKey: feedbackKeys.list(projectId),
    queryFn: () => fetchFeedback(projectId),
    staleTime: Infinity, // Use cache until invalidated
    gcTime: Infinity, // Keep in cache indefinitely
  });
}

