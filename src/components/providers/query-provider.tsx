/**
 * QueryProvider Component
 * 
 * Wraps the application with TanStack React Query's QueryClientProvider.
 * This enables React Query hooks (useQuery, useMutation) throughout the app.
 * 
 * Usage:
 * Wrap your app in layout.tsx or _app.tsx with this provider.
 * 
 * @example
 * ```tsx
 * <QueryProvider>
 *   {children}
 * </QueryProvider>
 * ```
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "@/lib/query-client";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider Component
 * 
 * Provides React Query context to all child components.
 * 
 * @param {QueryProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} QueryClientProvider wrapper
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

