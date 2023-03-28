import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { subscriberSchema } from "~/utils/schemas";

export const subscriberRouter = createTRPCRouter({
  create: publicProcedure.input(subscriberSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.subscriber.create({
      data: {
        email: input.email,
        subscribed: input.subscribed,
        name: input.name,
        createdAt: input.createdAt,
        ListId: input.ListId,
      },
    });
  }),
  createMany: publicProcedure
    .input(z.array(subscriberSchema))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.subscriber.createMany({
        data: input,
        skipDuplicates: true,
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
    return ctx.prisma.subscriber.findMany();
  }),
});
