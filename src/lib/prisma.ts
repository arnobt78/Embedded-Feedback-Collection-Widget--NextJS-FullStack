/**
 * Prisma Client Singleton
 *
 * This file exports a single PrismaClient instance that is reused across
 * the application. This pattern prevents creating multiple database connections
 * during development (especially with Hot Module Replacement/HMR).
 *
 * Key Pattern: Singleton Pattern
 * - In development: Reuses same instance across HMR reloads
 * - In production: Creates new instance per server instance
 *
 * Why Singleton?
 * - Next.js dev mode uses HMR which can cause multiple PrismaClient instances
 * - Each PrismaClient opens a database connection pool
 * - Too many connections can exhaust database connection limits
 */

import { PrismaClient } from "@prisma/client";

// Use globalThis to store Prisma instance across HMR reloads in development
// globalThis works in both Node.js and browser environments
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

/**
 * Prisma Client Instance
 *
 * Reuses existing instance if available (development HMR), otherwise creates new one.
 *
 * Logging Configuration:
 * - "warn": Log Prisma warnings (deprecations, etc.)
 * - "error": Log Prisma errors
 * - Removed "query" and "info" to reduce log noise in development
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["warn", "error"], // Only log warnings and errors, not queries or info
  });

// Store instance on globalThis in development to persist across HMR reloads
// In production, this doesn't matter as the server doesn't reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

