/**
 * StatsCardSkeleton Component
 * 
 * Skeleton loader for statistics cards.
 * Matches the exact dimensions of the stats cards in the dashboard.
 * 
 * Usage:
 * ```tsx
 * <StatsCardSkeleton />
 * ```
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * StatsCardSkeleton Component
 * 
 * Skeleton loader that matches the exact dimensions of a stats card.
 * 
 * @returns {JSX.Element} Skeleton card
 */
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

