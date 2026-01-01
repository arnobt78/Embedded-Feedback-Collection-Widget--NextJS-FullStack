/**
 * Skeleton Component
 * 
 * Reusable skeleton loading component for placeholder content.
 * Provides animated loading placeholders that match the exact size of content.
 * 
 * Usage:
 * ```tsx
 * <Skeleton className="h-4 w-32" /> // Matches exact height and width
 * ```
 */

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };

