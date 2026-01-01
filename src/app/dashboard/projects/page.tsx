/**
 * Projects Management Page
 *
 * Page for managing projects (list, create, edit, delete).
 * Displays all projects in a table format with actions.
 *
 * Features:
 * - List all projects
 * - Create new project
 * - Edit existing project
 * - Delete project
 * - View project details
 * - Copy API key
 */

"use client";

import { useState } from "react";
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
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { toast } from "sonner";
import {
  Plus,
  Copy,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";

/**
 * Projects Management Page
 *
 * @returns {JSX.Element} Projects management page
 */
export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [visibleApiKeys, setVisibleApiKeys] = useState<Set<string>>(new Set());

  /**
   * Copy API key to clipboard
   */
  const handleCopyApiKey = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Failed to copy API key");
    }
  };

  /**
   * Toggle API key visibility
   */
  const toggleApiKeyVisibility = (projectId: string) => {
    const newVisible = new Set(visibleApiKeys);
    if (newVisible.has(projectId)) {
      newVisible.delete(projectId);
    } else {
      newVisible.add(projectId);
    }
    setVisibleApiKeys(newVisible);
  };

  /**
   * Handle project deletion
   */
  const handleDelete = async (projectId: string, projectName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    deleteProject.mutate(projectId);
  };

  return (
    <DashboardLayout
      title="Projects"
      description="Manage your connected projects and API keys"
      actions={
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              Manage projects that use the feedback widget
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => {
                  const isVisible = visibleApiKeys.has(project.id);
                  const maskedApiKey = `${project.apiKey.substring(
                    0,
                    8
                  )}...${project.apiKey.substring(project.apiKey.length - 4)}`;

                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-white/10 rounded-[20px] bg-gradient-to-br from-white/5 via-white/5 to-white/5 backdrop-blur-sm hover:border-white/20 hover:from-white/10 hover:via-white/10 hover:to-white/10 transition-all"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">{project.name}</h3>
                          {project.isActive ? (
                            <span className="text-xs border border-emerald-400/30 bg-gradient-to-r from-emerald-500/25 via-emerald-500/10 to-emerald-500/5 text-white px-2 py-0.5 rounded-md backdrop-blur-sm shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs border border-gray-400/30 bg-gradient-to-r from-gray-500/25 via-gray-500/10 to-gray-500/5 text-white/70 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-[0_10px_30px_rgba(107,114,128,0.2)]">
                              Inactive
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground">
                            {project.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {project.domain}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            API Key: {isVisible ? project.apiKey : maskedApiKey}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleApiKeyVisibility(project.id)}
                          >
                            {isVisible ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyApiKey(project.apiKey)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {project._count?.feedbacks ?? 0} feedback entries
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(project.id, project.name)}
                          disabled={deleteProject.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first project to start collecting feedback
                </p>
                <Link href="/dashboard/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
