/**
 * Script to build Tailwind CSS for the widget
 * This ensures CSS is processed before being included in the UMD bundle
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const inputCss = path.join(__dirname, "../src/app/globals.css");
const outputCss = path.join(__dirname, "../public/widget-styles.css");

console.log("Building widget CSS...");
console.log(`Input: ${inputCss}`);
console.log(`Output: ${outputCss}`);

try {
  execSync(
    `npx tailwindcss -i "${inputCss}" -o "${outputCss}" --minify`,
    { stdio: "inherit", cwd: path.join(__dirname, "..") }
  );
  console.log("✅ Widget CSS built successfully!");
} catch (error) {
  console.error("❌ Failed to build widget CSS:", error.message);
  process.exit(1);
}

