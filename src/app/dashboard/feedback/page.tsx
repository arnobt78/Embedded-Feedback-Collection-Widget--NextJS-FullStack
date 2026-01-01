/**
 * Feedback Page
 * 
 * Page for viewing and managing feedback entries.
 * Displays all feedback in a sortable, filterable table.
 * 
 * Features:
 * - View all feedback entries
 * - Sort by date, rating
 * - Filter by message content
 * - Toggle column visibility
 * - Pagination
 */

"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeedbackTable } from "@/components/dashboard/feedback-table";
import { useFeedback } from "@/hooks/use-feedback";
import { useProjects } from "@/hooks/use-projects";
import { MessageSquare } from "lucide-react";

/**
 * Feedback Page
 * 
 * @returns {JSX.Element} Feedback page
 */
export default function FeedbackPage() {
  const { data: feedback, isLoading } = useFeedback();
  const { data: projects } = useProjects();

  return (
    <DashboardLayout
      title="Feedback"
      description="View and manage all feedback submissions"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              All Feedback
            </CardTitle>
            <CardDescription>
              View and manage feedback from all your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackTable
              data={feedback ?? []}
              isLoading={isLoading}
              projects={projects?.map((p) => ({ id: p.id, name: p.name })) ?? []}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

