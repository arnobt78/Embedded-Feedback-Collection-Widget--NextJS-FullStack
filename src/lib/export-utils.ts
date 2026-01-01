/**
 * Export Utilities
 * 
 * Utility functions for exporting data to various formats (CSV, JSON, etc.).
 * Provides reusable export functionality for tables and data.
 */

/**
 * Convert an array of objects to CSV format
 * 
 * @param {Array<Record<string, unknown>>} data - Array of objects to convert
 * @param {string[]} headers - Array of header names (optional, will use object keys if not provided)
 * @returns {string} CSV string
 */
export function convertToCSV(
  data: Array<Record<string, unknown>>,
  headers?: string[]
): string {
  if (data.length === 0) {
    return "";
  }

  // Extract headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }
    const stringValue = String(value);
    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Create CSV rows
  const rows = data.map((row) =>
    csvHeaders.map((header) => escapeCSV(row[header])).join(",")
  );

  // Combine headers and rows
  return [csvHeaders.join(","), ...rows].join("\n");
}

/**
 * Download data as CSV file
 * 
 * @param {Array<Record<string, unknown>>} data - Data to export
 * @param {string} filename - Filename for the downloaded file
 * @param {string[]} headers - Optional headers (will use object keys if not provided)
 */
export function downloadCSV(
  data: Array<Record<string, unknown>>,
  filename: string,
  headers?: string[]
): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download data as JSON file
 * 
 * @param {unknown} data - Data to export
 * @param {string} filename - Filename for the downloaded file
 */
export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    filename.endsWith(".json") ? filename : `${filename}.json`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

