/**
 * DashboardLayout Component
 * 
 * Reusable layout wrapper for dashboard pages.
 * Provides consistent layout structure with sidebar and content area.
 * 
 * Features:
 * - Responsive sidebar (desktop: always visible, mobile: sheet overlay)
 * - Header with title and actions
 * - Main content area
 * - Consistent spacing and styling
 * 
 * Usage:
 * Wrap dashboard page content with this layout component.
 */

"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * DashboardLayout Component
 * 
 * Main layout wrapper for dashboard pages.
 * 
 * @param {DashboardLayoutProps} props - Component props
 * @param {ReactNode} props.children - Page content
 * @param {string} props.title - Page title (displayed in header)
 * @param {string} props.description - Optional page description
 * @param {ReactNode} props.actions - Optional action buttons/content for header
 * @returns {JSX.Element} Dashboard layout
 */
export function DashboardLayout({
  children,
  title,
  description,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),transparent_65%)]">
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),transparent_60%)]" />
      
      <div className="relative z-10 flex h-screen w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header title={title} description={description} actions={actions} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container py-6 px-4 md:px-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

