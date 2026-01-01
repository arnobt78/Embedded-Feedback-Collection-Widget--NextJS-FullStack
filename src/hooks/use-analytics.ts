/**
 * useAnalytics Hook
 * 
 * React Query hook for fetching analytics data.
 * Provides aggregated statistics and analytics.
 * 
 * Features:
 * - Infinite cache (data cached until invalidated)
 * - Filter by project ID
 * - Type-safe API calls
 * - Error handling
 * 
 * Usage:
 * ```tsx
 * const { data: analytics, isLoading } = useAnalytics();
 * const { data: projectAnalytics } = useAnalytics(projectId);
 * ```
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsData } from "@/types";

/**
 * Fetch analytics data from the API.
 * 
 * @param {string | null} projectId - Optional project ID to filter by
 * @returns {Promise<AnalyticsData>} Analytics data
 */
async function fetchAnalytics(
  projectId?: string | null
): Promise<AnalyticsData> {
  const url = projectId
    ? `/api/business-insights?projectId=${projectId}`
    : "/api/business-insights";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}

/**
 * React Query Keys
 * 
 * Centralized query keys for consistent cache management.
 */
export const analyticsKeys = {
  all: ["analytics"] as const,
  lists: () => [...analyticsKeys.all, "list"] as const,
  list: (projectId?: string | null) =>
    [...analyticsKeys.lists(), projectId] as const,
};

/**
 * useAnalytics Hook
 * 
 * Fetches analytics data, optionally filtered by project ID.
 * 
 * @param {string | null | undefined} projectId - Optional project ID to filter by
 * @returns {UseQueryResult<AnalyticsData>} React Query result
 */
export function useAnalytics(projectId?: string | null) {
  return useQuery({
    queryKey: analyticsKeys.list(projectId),
    queryFn: () => fetchAnalytics(projectId),
    staleTime: Infinity, // Use cache until invalidated
    gcTime: Infinity, // Keep in cache indefinitely
  });
}

