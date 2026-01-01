/**
 * Migration Script: Migrate Existing Feedback to Default Project
 * 
 * This script creates a default project and assigns all existing feedback entries
 * to it for backward compatibility. This ensures that existing feedback data
 * continues to work after adding the Project model.
 * 
 * Usage:
 *   npx tsx scripts/migrate-to-projects.ts
 * 
 * Or add to package.json:
 *   "migrate:default-project": "tsx scripts/migrate-to-projects.ts"
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

/**
 * Generate a secure random API key
 * 
 * @returns {string} A random 32-character hexadecimal string
 */
function generateApiKey(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Main migration function
 * 
 * Creates a default project and assigns all existing feedback to it.
 */
async function migrateToProjects() {
  try {
    console.log("🚀 Starting migration to projects model...\n");

    // Check if default project already exists
    const existingDefaultProject = await prisma.project.findFirst({
      where: {
        name: "Default Project",
      },
    });

    let defaultProject;

    if (existingDefaultProject) {
      console.log("✅ Default project already exists, using existing project");
      defaultProject = existingDefaultProject;
    } else {
      // Create default project
      console.log("📦 Creating default project...");
      defaultProject = await prisma.project.create({
        data: {
          name: "Default Project",
          domain: "https://localhost:3000",
          apiKey: generateApiKey(),
          description: "Default project for existing feedback entries",
          isActive: true,
        },
      });
      console.log(`✅ Default project created with ID: ${defaultProject.id}`);
      console.log(`   API Key: ${defaultProject.apiKey}\n`);
    }

    // Find all feedback entries without a projectId
    const feedbacksWithoutProject = await prisma.feedback.findMany({
      where: {
        projectId: null,
      },
    });

    if (feedbacksWithoutProject.length === 0) {
      console.log("✅ All feedback entries already have a project assigned");
      return;
    }

    console.log(`📝 Found ${feedbacksWithoutProject.length} feedback entries without project assignment`);
    console.log("🔄 Assigning feedback to default project...\n");

    // Update all feedback entries to assign them to default project
    const updateResult = await prisma.feedback.updateMany({
      where: {
        projectId: null,
      },
      data: {
        projectId: defaultProject.id,
      },
    });

    console.log(`✅ Successfully assigned ${updateResult.count} feedback entries to default project`);
    console.log("\n✨ Migration completed successfully!");

    // Display summary
    const totalFeedbacks = await prisma.feedback.count({
      where: {
        projectId: defaultProject.id,
      },
    });

    console.log(`\n📊 Summary:`);
    console.log(`   - Default Project ID: ${defaultProject.id}`);
    console.log(`   - Default Project API Key: ${defaultProject.apiKey}`);
    console.log(`   - Total feedback entries: ${totalFeedbacks}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateToProjects()
  .then(() => {
    console.log("\n🎉 Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration script failed:", error);
    process.exit(1);
  });

