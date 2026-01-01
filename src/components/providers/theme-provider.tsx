/**
 * ThemeProvider Component
 * 
 * Wraps the application with next-themes ThemeProvider.
 * Enables theme switching (light/dark) throughout the app.
 * 
 * Usage:
 * Wrap your app in layout.tsx with this provider (before QueryProvider).
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeProvider Component
 * 
 * Provides theme context to all child components.
 * Enables theme switching and theme-aware components.
 * 
 * @param {ThemeProviderProps} props - ThemeProvider props (from next-themes)
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} ThemeProvider wrapper
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

