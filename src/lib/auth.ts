// src/lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";

// Define the shape of the user object
export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "business_owner" | "normal_user" | "event_organizer" | "admin";
  tenantId?: number;
};

// Function to verify credentials against the database
async function verifyCredentials(email: string, password: string) {
  try {
    // In a real implementation, this would query the database
    // For now, we'll use a mock implementation
    const mockUsers = [
      {
        id: 1,
        email: "admin@example.com",
        passwordHash: "$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      },
      {
        id: 2,
        email: "owner@example.com",
        passwordHash: "$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti",
        firstName: "Business",
        lastName: "Owner",
        role: "business_owner",
        tenantId: 1,
      },
      {
        id: 3,
        email: "user1@example.com",
        passwordHash: "$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti",
        firstName: "Normal",
        lastName: "User1",
        role: "normal_user",
      },
    ];

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return null;
    }

    // In a real implementation, we would use bcrypt.compare
    // For now, we'll just check if the hash matches our test hash
    const isValid = user.passwordHash === "$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti";
    
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
    };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyCredentials(
          credentials.email,
          credentials.password
        );

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as number | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});
