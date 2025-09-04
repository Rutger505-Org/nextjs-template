import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { randomUUID } from "node:crypto";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Nodemailer({
      from: env.AUTH_EMAIL_FROM,
      server: {
        host: env.AUTH_EMAIL_HOST,
        port: env.AUTH_EMAIL_PORT,
        auth: {
          user: env.AUTH_EMAIL_USER,
          pass: env.AUTH_EMAIL_PASSWORD,
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log(credentials);

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log("Authorizing user...");
        return {
          id: randomUUID(),
          name: "Test User",
          email: "hi@example.com",
        };

        // 🔑 Example: look up user in Drizzle
        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, credentials.email),
        });

        if (!user) return null;

        // ⚠️ Replace with proper password hashing (e.g. bcrypt)
        const isValidPassword = credentials.password === "test123"; // placeholder
        if (!isValidPassword) return null;

        // return {
        //   id: user.id,
        //   name: user.name,
        //   email: user.email,
        // };
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  trustHost: true,
} satisfies NextAuthConfig;
