/**
 * TanStack React Query Client Configuration
 * 
 * This file exports a QueryClient instance configured for the application.
 * 
 * QueryClient Configuration:
 * - defaultOptions: Global defaults for all queries and mutations
 *   - queries: Default query behavior (staleTime, cacheTime, refetchOnWindowFocus)
 *   - mutations: Default mutation behavior (retry, etc.)
 * 
 * Key Features:
 * - Infinite cache: Queries are cached indefinitely until invalidated
 * - Automatic refetch on window focus: Keeps data fresh when user returns to tab
 * - Network mode: Only refetch when online
 */

"use client";

import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient Instance
 * 
 * Configured with production-ready defaults:
 * - staleTime: Infinity - Data never becomes stale (use until explicitly invalidated)
 * - cacheTime: Infinity - Cache never expires
 * - refetchOnWindowFocus: true - Refetch when user returns to tab (optional, can be disabled)
 * - refetchOnReconnect: true - Refetch when network reconnects
 * - retry: 1 - Retry failed requests once
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Data never becomes stale (use cache until invalidated)
      gcTime: Infinity, // Cache never expires (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus (manual refresh only)
      refetchOnReconnect: true, // Refetch when network reconnects
      retry: 1, // Retry failed requests once
      networkMode: "online" as const, // Only execute queries when online
    },
    mutations: {
      retry: 1, // Retry failed mutations once
      networkMode: "online" as const, // Only execute mutations when online
    },
  },
});

