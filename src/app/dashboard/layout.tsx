/**
 * Dashboard Layout (Route Layout)
 * 
 * Next.js route layout for all dashboard pages.
 * This layout wraps all routes under /dashboard.
 * 
 * This is a Server Component that provides the layout structure
 * for all dashboard child pages.
 */

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout doesn't render the Sidebar/Header here
  // Individual dashboard pages will use DashboardLayout component
  // This route layout is for any shared logic/wrappers at the route level
  return <>{children}</>;
}

