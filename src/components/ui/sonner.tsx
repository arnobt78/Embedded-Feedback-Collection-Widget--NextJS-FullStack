/**
 * Sonner Toaster Component
 * 
 * A modern toast notification component using Sonner library.
 * Provides toast notifications throughout the application.
 * 
 * Usage:
 * Import { toast } from "sonner" and use toast.success(), toast.error(), etc.
 */

"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster Component
 * 
 * Global toast notification provider for the application.
 * Uses Sonner library for modern, accessible toast notifications.
 * Integrates with next-themes for theme-aware toast styling.
 * 
 * @param {ToasterProps} props - Sonner Toaster props
 * @returns {JSX.Element} Sonner Toaster component
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
