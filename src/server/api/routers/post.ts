import { z } from "zod";

import { sendDiscordMessage } from "@/lib/discord";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return posts ?? null;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
      await sendDiscordMessage(`New post created: ${input.name}`);
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), newName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(posts)
        .set({ name: input.newName })
        .where(eq(posts.id, input.id));
    }),
});
