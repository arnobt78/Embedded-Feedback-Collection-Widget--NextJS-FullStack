/**
 * StatCard Component
 * 
 * Reusable statistics card component for displaying metrics.
 * Provides consistent styling and layout for dashboard statistics.
 * 
 * Features:
 * - Icon support
 * - Title and value
 * - Optional description
 * - Loading state
 * 
 * Usage:
 * ```tsx
 * <StatCard
 *   title="Total Feedback"
 *   value={100}
 *   description="All time"
 *   icon={<MessageSquare />}
 * />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  colorVariant?: "sky" | "emerald" | "amber" | "rose" | "violet" | "blue";
}

/**
 * StatCard Component
 * 
 * @param {StatCardProps} props - Component props
 * @param {string} props.title - Card title
 * @param {string | number} props.value - Main value to display
 * @param {string} props.description - Optional description text
 * @param {LucideIcon} props.icon - Optional icon component
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} Statistics card
 */
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading = false,
  colorVariant = "sky",
}: StatCardProps) {
  // Color variants configuration
  const colorConfig = {
    sky: {
      border: "border-sky-400/30",
      gradient: "from-sky-500/25 via-sky-500/10 to-sky-500/5",
      shadow: "shadow-[0_30px_80px_rgba(2,132,199,0.35)]",
      hoverBorder: "hover:border-sky-300/50",
    },
    emerald: {
      border: "border-emerald-400/30",
      gradient: "from-emerald-500/25 via-emerald-500/10 to-emerald-500/5",
      shadow: "shadow-[0_30px_80px_rgba(16,185,129,0.3)]",
      hoverBorder: "hover:border-emerald-300/50",
    },
    amber: {
      border: "border-amber-400/30",
      gradient: "from-amber-500/30 via-amber-500/15 to-amber-500/5",
      shadow: "shadow-[0_30px_80px_rgba(245,158,11,0.25)]",
      hoverBorder: "hover:border-amber-300/60",
    },
    rose: {
      border: "border-rose-400/30",
      gradient: "from-rose-500/25 via-rose-500/10 to-rose-500/5",
      shadow: "shadow-[0_30px_80px_rgba(225,29,72,0.35)]",
      hoverBorder: "hover:border-rose-300/50",
    },
    violet: {
      border: "border-violet-400/30",
      gradient: "from-violet-500/25 via-violet-500/10 to-violet-500/5",
      shadow: "shadow-[0_30px_80px_rgba(139,92,246,0.35)]",
      hoverBorder: "hover:border-violet-300/50",
    },
    blue: {
      border: "border-blue-400/30",
      gradient: "from-blue-500/25 via-blue-500/10 to-blue-500/5",
      shadow: "shadow-[0_30px_80px_rgba(59,130,246,0.35)]",
      hoverBorder: "hover:border-blue-300/50",
    },
  };

  const colors = colorConfig[colorVariant];

  if (isLoading) {
    return (
      <article className="group rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/5 p-6 backdrop-blur-sm shadow-lg transition">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24 bg-white/10" />
        </div>
        <div className="px-0">
          <Skeleton className="h-8 w-16 mb-2 bg-white/10" />
          <Skeleton className="h-3 w-32 bg-white/10" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group rounded-[28px] border ${colors.border} bg-gradient-to-br ${colors.gradient} p-6 ${colors.shadow} backdrop-blur-sm transition ${colors.hoverBorder}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.45em] text-white/60">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        {Icon && (
          <Icon className="h-5 w-5 text-white/60 flex-shrink-0 mt-1" />
        )}
      </div>
      {description && (
        <p className="mt-4 text-sm text-white/70">{description}</p>
      )}
    </article>
  );
}

