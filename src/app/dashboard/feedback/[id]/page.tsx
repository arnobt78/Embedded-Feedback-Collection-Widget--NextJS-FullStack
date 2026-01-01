/**
 * Feedback Detail Page
 * 
 * Page for viewing individual feedback entry details.
 * Displays full feedback information including metadata.
 * 
 * Features:
 * - View complete feedback details
 * - Project information
 * - Metadata display (if available)
 * - Navigation back to feedback list
 */

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeedback } from "@/hooks/use-feedback";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, User, Calendar, Star, Globe } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface FeedbackDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Feedback Detail Page
 * 
 * @param {FeedbackDetailPageProps} props - Component props
 * @returns {JSX.Element} Feedback detail page
 */
export default function FeedbackDetailPage({ params }: FeedbackDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: feedbackList, isLoading } = useFeedback();

  const feedback = feedbackList?.find((f) => f.id === id);

  if (isLoading) {
    return (
      <DashboardLayout
        title="Feedback Details"
        description="Loading feedback details..."
      >
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!feedback) {
    return (
      <DashboardLayout
        title="Feedback Not Found"
        description="The feedback you're looking for doesn't exist"
      >
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Feedback not found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/feedback")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feedback
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const createdAt = new Date(feedback.createdAt);
  const metadata = feedback.metadata as Record<string, unknown> | null;

  return (
    <DashboardLayout
      title="Feedback Details"
      description="View detailed feedback information"
    >
      <div className="max-w-4xl space-y-6">
        {/* Navigation */}
        <div>
          <Link href="/dashboard/feedback">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feedback
            </Button>
          </Link>
        </div>

        {/* Main Feedback Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Feedback Details</CardTitle>
                <CardDescription>
                  Submitted on {format(createdAt, "PPpp")}
                </CardDescription>
              </div>
              {feedback.rating && (
                <div className="flex items-center gap-1 text-2xl">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{feedback.rating}/5</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message */}
            <div>
              <h3 className="text-sm font-medium mb-2">Message</h3>
              <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                {feedback.message}
              </p>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              {feedback.name && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Name</h3>
                  </div>
                  <p className="text-sm">{feedback.name}</p>
                </div>
              )}
              {feedback.email && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Email</h3>
                  </div>
                  <a
                    href={`mailto:${feedback.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {feedback.email}
                  </a>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Submitted</h3>
                </div>
                <p className="text-sm">{format(createdAt, "PPpp")}</p>
              </div>
              {feedback.project && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Project</h3>
                  </div>
                  <Link
                    href={`/dashboard/projects/${feedback.project.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {feedback.project.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Metadata */}
            {metadata && Object.keys(metadata).length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    {Object.entries(metadata).map(([key, value]) => (
                      <div key={key} className="flex gap-4 text-sm">
                        <span className="font-medium text-muted-foreground capitalize w-32">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="flex-1">
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

