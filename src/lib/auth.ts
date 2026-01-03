/**
 * NextAuth Configuration and Auth Helper
 *
 * Centralized authentication configuration and exports.
 * This file is separate from the route handler to allow importing `auth` in other files.
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * NextAuth Configuration
 *
 * Defines authentication providers and callbacks.
 */
const authConfig: NextAuthConfig = {
  // Note: Adapter is not needed when using JWT strategy with credentials provider
  // PrismaAdapter is only needed for database sessions (OAuth providers)
  // For JWT sessions with credentials, we don't use the adapter
  trustHost: true, // Required for NextAuth v5 in development
  providers: [
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // Return user object (will be stored in session)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google, GitHub, etc.) - create/find user in database
      if (account?.provider === "google" && user.email) {
        try {
          // Type-safe profile data extraction
          const googleProfile = profile as
            | { name?: string; picture?: string; email_verified?: boolean }
            | undefined;

          // Check if user exists in database
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // If user doesn't exist, create them with MongoDB ObjectID
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || googleProfile?.name || null,
                image: user.image || googleProfile?.picture || null,
                emailVerified: googleProfile?.email_verified
                  ? new Date()
                  : null,
              },
            });
          } else {
            // Update user info if it changed
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                name: user.name || googleProfile?.name || dbUser.name,
                image: user.image || googleProfile?.picture || dbUser.image,
                emailVerified: googleProfile?.email_verified
                  ? new Date()
                  : dbUser.emailVerified,
              },
            });
          }

          // Replace user.id with database ObjectID (this will be used in jwt callback)
          user.id = dbUser.id;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Block sign in on error
        }
      }
      return true; // Allow sign in
    },
    async jwt({ token, user }) {
      if (user) {
        // Use database ObjectID from user (set in signIn callback for OAuth, or from authorize for credentials)
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Extend session user with id property from token (MongoDB ObjectID)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};

/**
 * NextAuth Handler
 *
 * Creates the NextAuth handler with the configuration.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
