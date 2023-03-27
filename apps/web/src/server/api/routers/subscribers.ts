import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subscriberRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        subscribed: z.boolean(),
        createdAt: z.date(),
        ListId: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.list.create({
        data: {
          name: input.name,
        },
      });
    }),
  getAllFromList: publicProcedure
    .input(
      z.object({
        ListId: z.number().int(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.subscriber.findMany({
        where: {
          ListId: input.ListId,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.list.findMany();
  }),
});
