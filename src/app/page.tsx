/**
 * Home Page Component
 *
 * The main landing page of the application.
 * Displays the feedback widget centered on the page.
 *
 * This is a Server Component by default in Next.js App Router.
 * The Widget component inside is a Client Component (marked with "use client").
 */

import Widget from "@/components/Widget";

/**
 * Home Page
 *
 * Simple page that centers the feedback widget on the screen.
 * Uses Tailwind CSS for styling with flexbox for centering.
 *
 * @returns {JSX.Element} Home page with centered widget
 */
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Widget component is rendered here - it will appear as a floating button */}
      <Widget />
    </main>
  );
}
