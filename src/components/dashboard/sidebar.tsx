/**
 * Sidebar Component
 *
 * Reusable sidebar navigation component for the dashboard.
 * Provides navigation links, mobile menu support, and active route highlighting.
 *
 * Features:
 * - Responsive design (collapsible on mobile using Sheet)
 * - Active route highlighting
 * - Navigation menu items
 * - Logo/home link
 *
 * Usage:
 * Wrap dashboard pages with SidebarProvider and use this component.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  BarChart3,
  Menu,
  Home,
  LogOut,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Navigation items configuration
 *
 * Defines the main navigation links for the dashboard.
 */
const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/dashboard/business-insights",
    icon: BarChart3,
  },
];

/**
 * SidebarContent Component
 *
 * Renders the sidebar navigation content.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.mobile - Whether this is the mobile version
 * @returns {JSX.Element} Sidebar content
 */
function SidebarContent({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<{
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
  } | null>(null);

  /**
   * Fetch session data
   */
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, []);

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (
    name: string | null | undefined,
    email: string | null | undefined
  ): string => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/auth/signin",
    });
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <div className={cn("flex flex-col h-full", mobile && "overflow-y-auto")}>
      {/* Logo/Home Link */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10 min-h-[4rem]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold text-white hover:opacity-80 transition-opacity"
        >
          <Home className="h-5 w-5" />
          <span>Feedback Widget</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className={cn("flex-1 p-4 space-y-1", mobile && "pb-4")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User Info and Logout */}
      <div className={cn("p-4 space-y-3", mobile && "pb-4")}>
        {/* User Info Card */}
        {session?.user && (
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/5 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {/* Avatar with Initials */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/30 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(139,92,246,0.25)]">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || session.user.email || "User"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {getUserInitials(session.user.name, session.user.email)}
                  </span>
                )}
              </div>
              {/* User Name and Email */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {session.user.name || "User"}
                </p>
                <p className="truncate text-xs text-white/70">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
        <div className="text-sm text-white/60">Dashboard v1.0.0</div>
      </div>
    </div>
  );
}

/**
 * Sidebar Component (Desktop)
 *
 * Desktop sidebar that's always visible.
 *
 * @returns {JSX.Element} Desktop sidebar
 */
export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-white/10 md:bg-background/50 md:backdrop-blur-xl">
      <SidebarContent />
    </aside>
  );
}

/**
 * MobileSidebar Component
 *
 * Mobile sidebar that uses Sheet component for overlay menu.
 *
 * @returns {JSX.Element} Mobile sidebar with Sheet
 */
export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation menu for dashboard pages
        </SheetDescription>
        <SidebarContent mobile />
      </SheetContent>
    </Sheet>
  );
}
