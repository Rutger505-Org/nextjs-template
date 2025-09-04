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
import { type Adapter } from "@auth/core/adapters";
import { randomUUID } from "crypto";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";

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
// TODO finish https://github.com/nextauthjs/next-auth/discussions/4394#discussioncomment-3293618
const drizzleAdapter: Required<
  Pick<Adapter, "createSession" | "getSessionAndUser" | "deleteSession">
> &
  Adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

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

        const user = {
          id: "1",
          email: credentials.email,
          name: "Demo User",
          image: null,
        };

        const token = randomUUID();
        await drizzleAdapter.createSession({
          userId: user.id,
          expires: new Date(Date.now() + maxAge * 1000),
          sessionToken: token,
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          sessionToken: token,
        };
      },
    }),
  ],
  adapter: drizzleAdapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.sessionToken = user.sessionToken;
      }

      if (token?.sessionToken) {
        const { session } = await drizzleAdapter.getSessionAndUser(
          token.sessionToken,
        );
        if (!session) {
          return null;
        }
      }

      return token;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    signOut: async ({ token }) => {
      if (
        typeof token === "object" &&
        token !== null &&
        "sessionToken" in token &&
        token.sessionToken &&
        drizzleAdapter?.deleteSession
      ) {
        await drizzleAdapter.deleteSession(token.sessionToken);
      }
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
