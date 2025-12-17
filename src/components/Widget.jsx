/**
 * Widget Component - Main Feedback Collection Widget
 * 
 * This is a reusable feedback widget component that can be embedded in any web application.
 * It provides a floating button that opens a popover with a feedback form.
 * 
 * Key Features:
 * - Collects user feedback (name, email, message, and star rating)
 * - Configurable API endpoint via props
 * - Real-time form validation and error handling
 * - Success state after submission
 * - Accessible UI components from Radix UI
 */

"use client"; // Required for Next.js App Router - marks this as a Client Component (runs in browser)

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Widget Component
 * @param {string} apiBase - The API endpoint URL for submitting feedback (defaults to "/api/feedback")
 * @returns {JSX.Element} The feedback widget component
 */
export default function Widget({ apiBase = "/api/feedback" }) {
  // State management using React hooks
  // rating: Current selected star rating (1-5), defaults to 3
  const [rating, setRating] = useState(3);
  // submitted: Boolean flag to show success message after form submission
  const [submitted, setSubmitted] = useState(false);
  // loading: Boolean flag to disable button and show loading state during API call
  const [loading, setLoading] = useState(false);
  // error: String to store and display error messages from API or network failures
  const [error, setError] = useState("");

  /**
   * Handles star rating selection
   * @param {number} index - The zero-based index of the clicked star (0-4)
   * Converts to 1-based rating (1-5) for better UX and database storage
   */
  const onSelectStar = (index) => {
    setRating(index + 1);
  };

  /**
   * Handles form submission
   * Collects form data and sends it to the API endpoint
   * 
   * @param {Event} e - Form submit event
   * 
   * Process:
   * 1. Prevents default form submission (page reload)
   * 2. Extracts form values using native form API
   * 3. Sends POST request to configurable API endpoint
   * 4. Handles success/error states appropriately
   * 5. Optionally triggers external dashboard refresh if callback exists
   */
  const submit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    setLoading(true); // Show loading state
    setError(""); // Clear any previous errors
    
    // Extract form values using native form API (no need for controlled inputs for simple forms)
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.feedback.value;
    
    // POST to configurable API endpoint
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, rating }), // Send all form data as JSON
      });
      
      if (!res.ok) {
        // Handle API errors (400, 500, etc.)
        const data = await res.json();
        setError(data.error || "Failed to submit feedback");
      } else {
        // Success - show thank you message
        setSubmitted(true);
        
        // Try to refresh dashboard if available
        // This allows integration with external dashboards that might display feedback
        // Uses window global to avoid tight coupling
        if (window.refreshFeedbackDashboard) {
          window.refreshFeedbackDashboard();
        }
      }
    } catch (err) {
      // Handle network errors (no internet, CORS issues, etc.)
      setError("Network error");
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    // Fixed positioning keeps widget always visible in bottom-right corner
    // z-50 ensures it appears above most content
    <div className="widget fixed bottom-4 right-4 z-50">
      {/* Radix UI Popover provides accessible, keyboard-navigable popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full shadow-lg hover:scale-105">
            <MessageCircleIcon className="mr-2 h-5 w-5" />
            Feedback
          </Button>
        </PopoverTrigger>
        <PopoverContent className="widget rounded-lg bg-white bg-opacity-95 p-4 shadow-lg w-full max-w-md border border-gray-200">
          {submitted ? (
            <div>
              <h3 className="text-lg font-bold">
                Thank you for your feedback!
              </h3>
              <p className="mt-4">
                We appreciate your feedback. It helps us improve our product and
                provide better service to our customers.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold">Send us your feedback</h3>
              <form className="space-y-2" onSubmit={submit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  {/* Star Rating Component */}
                  {/* Creates 5 clickable stars using Array spread and map */}
                  {/* Visual state: filled (yellow) for selected, empty (gray) for unselected */}
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        filled={rating > index} // Show filled if rating is greater than current index
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          rating > index
                            ? "fill-yellow-400 stroke-yellow-400" // Selected: yellow
                            : "fill-none stroke-gray-400" // Unselected: gray outline
                        }`}
                        onClick={() => onSelectStar(index)} // Click updates rating state
                      />
                    ))}
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </form>
            </div>
          )}
          <Separator className="my-4" />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * StarIcon Component - Reusable SVG star icon
 * 
 * @param {boolean} filled - Whether the star should be filled or outlined
 * @param {...any} props - Additional props passed to SVG element
 * 
 * Uses SVG for crisp rendering at any size and easy color customization
 */
function StarIcon({ filled, ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/**
 * MessageCircleIcon Component - Message bubble icon for the widget trigger button
 * 
 * Uses Lucide icon design patterns with SVG for consistent styling
 * @param {...any} props - Props passed to SVG element (className, size, etc.)
 */
function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-message-circle"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
