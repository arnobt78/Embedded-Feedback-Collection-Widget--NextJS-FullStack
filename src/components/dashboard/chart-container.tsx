/**
 * ChartContainer Component
 * 
 * Reusable container component for charts.
 * Provides consistent styling and loading states for chart visualizations.
 * 
 * Features:
 * - Loading skeleton
 * - Empty state handling
 * - Consistent card styling
 * - Responsive container
 * 
 * Usage:
 * ```tsx
 * <ChartContainer
 *   title="My Chart"
 *   description="Chart description"
 *   isLoading={loading}
 *   isEmpty={!data || data.length === 0}
 * >
 *   <ChartComponent data={data} />
 * </ChartContainer>
 * ```
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: number;
}

/**
 * ChartContainer Component
 * 
 * @param {ChartContainerProps} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.description - Optional chart description
 * @param {ReactNode} props.children - Chart component
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isEmpty - Empty data state
 * @param {string} props.emptyMessage - Custom empty state message
 * @param {number} props.height - Chart height (default: 300)
 * @returns {JSX.Element} Chart container
 */
export function ChartContainer({
  title,
  description,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  height = 300,
}: ChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full" style={{ height: `${height}px` }} />
        ) : isEmpty ? (
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: `${height}px` }}
          >
            {emptyMessage}
          </div>
        ) : (
          <div className="w-full" style={{ height: `${height}px`, minWidth: 0, minHeight: `${height}px`, position: "relative" }}>{children}</div>
        )}
      </CardContent>
    </Card>
  );
}

